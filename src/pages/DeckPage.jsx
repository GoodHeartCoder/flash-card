import { useParams } from "react-router-dom";
import styles from "./DeckPage.module.css";
import CardEditor from "../components/CardEditor";
import CardsTable from "../components/CardsTable";
import { useEffect, useState } from "react";
function DeckPage() {
  const { id: deckId } = useParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("<br>");
  const [currentAnswer, setCurrentAnswer] = useState("<br>");
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
    <div className={styles.DeckPage}>
      <CardsTable currentDeck={currentDeck} />
      <CardEditor
        deckId={deckId}
        setCurrentDeck={setCurrentDeck}
        getCurrentDeck={getCurrentDeck}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        currentAnswer={currentAnswer}
        setCurrentAnswer={setCurrentAnswer}
      />
    </div>
  );
}
// card list
//
export default DeckPage;
