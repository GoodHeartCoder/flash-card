import styles from "./CardEditor.module.css";
import { useState } from "react";
import { nanoid } from "nanoid";
import Button from "./Button";

function CardEditor({
  deckId,
  getCurrentDeck,
  currentQuestion,
  setCurrentQuestion,
  currentAnswer,
  setCurrentAnswer,
  editingCard,
  setEditingCard,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSaveCard(card) {
    setIsSubmitting(true);

    try {
      const deckRes = await fetch(`http://localhost:9000/decks/${deckId}`);
      const currentDeck = await deckRes.json();

      let updatedCards;

      if (editingCard) {
        // Update existing card
        updatedCards = currentDeck.cards.map((c) =>
          c.id === editingCard.id ? { ...card, id: editingCard.id } : c
        );
      } else {
        // Add new card
        updatedCards = [...currentDeck.cards, card];
      }

      const res = await fetch(`http://localhost:9000/decks/${deckId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: updatedCards }),
      });

      // Reset form
      setCurrentQuestion("");
      setCurrentAnswer("");
      setEditingCard(null);

      getCurrentDeck();
    } catch {
      console.log();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    setCurrentQuestion("");
    setCurrentAnswer("");
    setEditingCard(null);
  }

  return (
    <div className={styles.editorContainer}>
      <textarea
        className={`${styles.questionField} ${styles.Field}`}
        value={currentQuestion}
        onChange={(e) => setCurrentQuestion(e.target.value)}
        placeholder="Enter question"
        dir="auto"
      />
      <textarea
        className={`${styles.answerField} ${styles.Field}`}
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        placeholder="Enter answer"
        dir="auto"
      />
      <div className={styles.buttonGroup}>
        <Button
          onClick={() =>
            handleSaveCard({
              question: currentQuestion,
              answer: currentAnswer,
              id: editingCard?.id || nanoid(),
            })
          }
          text={editingCard ? "Update Card" : "Add Card"}
          className={styles.addCard}
          size="lg"
          disabled={isSubmitting}
        />
        {editingCard && (
          <Button
            onClick={handleCancel}
            text="Cancel"
            className={styles.cancelCard}
            size="lg"
            bgColor="#dc3545"
          />
        )}
      </div>
    </div>
  );
}

export default CardEditor;
