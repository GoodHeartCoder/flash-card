import styles from "./StudyPage.module.css";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

function StudyPage() {
  const { id: deckId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [currentDeck, setCurrentDeck] = useState(null);

  async function getCurrentDeck() {
    try {
      const res = await fetch(`http://localhost:9000/decks/${deckId}`);
      const deck = await res.json();
      setCurrentDeck(deck);
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
      <div className={styles.question}>{mode}</div>
      <div className={styles.answer}>{currentDeck?.name}</div>
      <div className={styles.buttons}>
        <Button text="Again" />
        <Button text="Hard" />
        <Button text="Good" />
        <Button text="Easy" />
      </div>
    </div>
  );
}

export default StudyPage;
