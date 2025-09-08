import styles from "./StudyPage.module.css";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

function StudyPage() {
  const { id: deckId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  function handleEasyButton() {
    if (studyArray.length === 1) return;
    // setStudyArray(studyArray.filter((_, index) => index !== currentIndex));
    setStudyArray(() => {
      const arr = studyArray.slice();
      arr.shift();
      return arr;
    });
  }
  console.log(studyArray);

  async function getCurrentDeck() {
    try {
      const res = await fetch(`http://localhost:9000/decks/${deckId}`);
      const deck = await res.json();
      setCurrentDeck(deck);
      setStudyArray(deck.cards.slice());
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
      <div className={styles.question}>
        {studyArray?.at(currentIndex).question}
      </div>
      <div className={styles.answer}>{studyArray?.at(currentIndex).answer}</div>
      <div className={styles.buttons}>
        <Button text="Again" />
        <Button text="Easy" onClick={handleEasyButton} />
      </div>
    </div>
  );
}

export default StudyPage;
