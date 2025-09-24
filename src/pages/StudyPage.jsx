import styles from "./StudyPage.module.css";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useBlocker, useParams, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function StudyPage() {
  const { id: deckId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const count = searchParams.get("count");
  const [currentDeck, setCurrentDeck] = useState(null);
  const [studyArray, setStudyArray] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle spaced repetition logic
  function handleSpacedRepetition(card, difficulty) {
    const now = new Date();
    let shouldRepeatInSession = false;
    let daysToAdd = 1;
    let updatedCard = { ...card };

    // Initialize session counters if they don't exist
    if (!updatedCard.sessionRepeats) updatedCard.sessionRepeats = 0;
    if (!updatedCard.sessionHards) updatedCard.sessionHards = 0;

    switch (difficulty) {
      case "again":
        // Always repeat in session for "again"
        shouldRepeatInSession = true;
        updatedCard.sessionRepeats += 1;
        daysToAdd = 1; // Will review tomorrow anyway
        break;

      case "hard":
        updatedCard.sessionHards += 1;
        if (updatedCard.sessionHards < 3) {
          // Repeat in session if less than 3 times
          shouldRepeatInSession = true;
          daysToAdd = 1;
        } else {
          // 3rd time clicking hard - schedule for tomorrow
          shouldRepeatInSession = false;
          daysToAdd = 1;
        }
        break;

      case "good":
        // Passed - schedule for later
        shouldRepeatInSession = false;
        daysToAdd = updatedCard.interval ? updatedCard.interval * 2.5 : 4;
        break;

      case "easy":
        // Easy - schedule much later
        shouldRepeatInSession = false;
        daysToAdd = updatedCard.interval ? updatedCard.interval * 4 : 7;
        break;
    }

    // Set next review date
    const nextReview = new Date(now);
    nextReview.setDate(nextReview.getDate() + Math.round(daysToAdd));

    updatedCard.interval = daysToAdd;
    updatedCard.nextReview = nextReview.toISOString();

    return { updatedCard, shouldRepeatInSession };
  }

  function randomizeCards(arr, count = arr.length) {
    // Create a copy to avoid mutating original
    const shuffled = [...arr];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Return the specified number of cards
    return shuffled.slice(0, count);
  }

  async function getCurrentDeck() {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:9000/decks/${deckId}`);
      const deck = await res.json();
      setCurrentDeck(deck);

      let cardsCopy = deck.cards.slice();

      if (mode === "spaced") {
        // Filter only cards that are due for review
        const now = new Date();
        cardsCopy = cardsCopy.filter((card) => {
          if (!card.nextReview) return true; // New cards (never studied)
          return new Date(card.nextReview) <= now; // Due cards
        });

        // If no cards are due or the deck is empty, mark as completed
        if (cardsCopy.length === 0) {
          setIsDeckCompleted(true);
          setStudyArray([]);
          return deck;
        }
      } else if (mode === "random") {
        const requestedCount = count ? parseInt(count) : cardsCopy.length;
        cardsCopy = randomizeCards(
          cardsCopy,
          Math.min(requestedCount, cardsCopy.length)
        );
        // If deck is empty, mark as completed
        if (cardsCopy.length === 0) {
          setIsDeckCompleted(true);
          setStudyArray([]);
          return deck;
        }
      }

      setStudyArray(cardsCopy);
      return deck;
    } catch {
      console.log("Error fetching deck");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCardResponse(difficulty) {
    if (mode === "spaced") {
      const currentCard = studyArray[0];

      // Use the handleSpacedRepetition function
      const { updatedCard, shouldRepeatInSession } = handleSpacedRepetition(
        currentCard,
        difficulty
      );

      // Update study array
      setStudyArray((prev) => {
        const newArray = prev.slice(1);

        if (shouldRepeatInSession) {
          // Add card back after 2-3 positions
          const insertIndex = Math.min(
            Math.floor(Math.random() * 2) + 2,
            newArray.length
          );
          newArray.splice(insertIndex, 0, updatedCard);
        }

        if (newArray.length === 0) {
          setIsDeckCompleted(true);
        }
        return newArray;
      });

      setHasAnswered(false);

      // Update database in background (only if not repeating in session)
      if (!shouldRepeatInSession) {
        // Update the entire deck since cards are nested
        const updatedDeck = { ...currentDeck };
        const cardIndex = updatedDeck.cards.findIndex(
          (card) => card.id === currentCard.id
        );

        if (cardIndex !== -1) {
          updatedDeck.cards[cardIndex] = {
            question: updatedCard.question,
            answer: updatedCard.answer,
            interval: updatedCard.interval,
            repetition: updatedCard.repetition,
            efactor: updatedCard.efactor,
            nextReview: updatedCard.nextReview,
            id: updatedCard.id,
            // Don't save sessionRepeats and sessionHards
          };

          fetch(`http://localhost:9000/decks/${deckId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cards: updatedDeck.cards,
            }),
          }).catch((error) => {
            console.error("Failed to update deck:", error);
          });
        }
      }

      return;
    }

    // Logic for other modes (all/random)
    if (mode === "all" || mode === "random") {
      if (studyArray.length === 1 && difficulty === "easy") {
        setIsDeckCompleted(true);
        return;
      }
      setHasAnswered(false);
      if (difficulty === "easy") {
        // Remove completely
        setStudyArray((studyArray) => {
          const arr = studyArray.slice();
          arr.shift();
          return arr;
        });
      } else {
        // Insert back at different positions
        setStudyArray((studyArray) => {
          const arr = studyArray.slice();
          const insertIndex =
            difficulty === "hard"
              ? Math.floor(Math.random() * 2) + 3 // positions 3-4
              : Math.floor(Math.random() * 3) + 6; // positions 6-8

          arr.splice(Math.min(insertIndex, arr.length), 0, arr[0]);
          arr.shift();
          return arr;
        });
      }
    }
  }

  useEffect(() => {
    getCurrentDeck();
  }, []);
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (mode === "spaced" && studyArray?.length > 0) e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [mode, studyArray]);

  return (
    <>
      {isLoading ? (
        <div
          style={{ display: "grid", placeContent: "center", height: "200px" }}
        >
          <LoadingSpinner size="xl" color="#007bff" />
        </div>
      ) : (
        <div className={styles.container}>
          {isDeckCompleted ? (
            <>
              <div className={styles.finishMessageScreen}>
                You Finished Studying this deck 📚
                <div>
                  <Link to="/">
                    <Button text="Go Back to Home Page" size="lg" />
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.question}>
                {studyArray?.at(0)?.question}
              </div>
              <div
                className={styles.answer}
                style={!hasAnswered ? { opacity: "0" } : {}}
              >
                {studyArray?.at(0)?.answer}
              </div>
              <div>Cards Left: {studyArray?.length}</div>
              <div className={styles.buttons}>
                {!hasAnswered ? (
                  <Button
                    text="Show Answer"
                    onClick={() => setHasAnswered(true)}
                  />
                ) : (
                  <>
                    <Button
                      text="Again"
                      onClick={() => handleCardResponse("again")}
                    />
                    <Button
                      text="Hard"
                      onClick={() => handleCardResponse("hard")}
                    />
                    {mode === "spaced" && (
                      <Button
                        text="Good"
                        onClick={() => handleCardResponse("good")}
                      />
                    )}
                    <Button
                      text="Easy"
                      onClick={() => handleCardResponse("easy")}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default StudyPage;
