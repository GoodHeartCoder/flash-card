import styles from "./StudyPage.module.css";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

function StudyPage() {
  const { id: deckId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [currentDeck, setCurrentDeck] = useState(null);
  const [studyArray, setStudyArray] = useState(null);

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

  function handleCardResponse(difficulty) {
    if (studyArray.length === 1) return;

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
  console.log(studyArray);

  async function getCurrentDeck() {
    try {
      const res = await fetch(`http://localhost:9000/decks/${deckId}`);
      const deck = await res.json();
      setCurrentDeck(deck);
      let cardsCopy = deck.cards.slice();
      if (mode === "random") cardsCopy = randomizeCards(cardsCopy);
      setStudyArray(cardsCopy);
      return deck;
    } catch {
      console.log();
    }
  }
  useEffect(() => {
    getCurrentDeck();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.question}>{studyArray?.at(0).question}</div>
      <div className={styles.answer}>{studyArray?.at(0).answer}</div>
      <div>Cards Left: {studyArray?.length}</div>
      <div className={styles.buttons}>
        <Button text="Again" onClick={() => handleCardResponse("again")} />
        <Button text="Hard" onClick={() => handleCardResponse("hard")} />
        <Button text="Easy" onClick={() => handleCardResponse("easy")} />
      </div>
    </div>
  );
}

export default StudyPage;
