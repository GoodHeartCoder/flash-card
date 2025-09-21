import { useParams } from "react-router-dom";
import styles from "./DeckPage.module.css";
import CardEditor from "../components/CardEditor";
import CardsTable from "../components/CardsTable";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
function DeckPage() {
  const { id: deckId } = useParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [editingCard, setEditingCard] = useState(null);
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
      {currentDeck === null ? (
        <div
          style={{
            background: "#f1f5f9",
            display: "grid",
            placeContent: "center",
            height: "100%",
          }}
        >
          {" "}
          <LoadingSpinner size="xl" />
        </div>
      ) : (
        <CardsTable
          currentDeck={currentDeck}
          deckId={deckId}
          setCurrentAnswer={setCurrentAnswer}
          setCurrentQuestion={setCurrentQuestion}
          getCurrentDeck={getCurrentDeck}
          setEditingCard={setEditingCard}
          editingCard={editingCard}
        />
      )}
      <CardEditor
        deckId={deckId}
        getCurrentDeck={getCurrentDeck}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        currentAnswer={currentAnswer}
        setCurrentAnswer={setCurrentAnswer}
        editingCard={editingCard}
        setEditingCard={setEditingCard}
      />
    </div>
  );
}
// card list
//
export default DeckPage;
