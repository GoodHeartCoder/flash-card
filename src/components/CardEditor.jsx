import styles from "./CardEditor.module.css";
import { useState } from "react";
import { nanoid } from "nanoid";
import Button from "./Button";
import useDecks from "../contexts/useDecks";

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
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useDecks();
  async function handleSaveCard(card) {
    setIsLoading(true);

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

      await fetch(`http://localhost:9000/decks/${deckId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: updatedCards }),
      });

      // Reset form

      await getCurrentDeck();
      setCurrentQuestion("");
      setCurrentAnswer("");
      setEditingCard(null);

      // Show success notification
      showNotification(
        "success",
        editingCard ? "Card updated successfully!" : "Card added successfully!",
        true
      );
    } catch {
      showNotification("error", "Failed to save the card", true);
    } finally {
      setIsLoading(false);
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
          onClick={() => {
            if (currentQuestion.trim() === "" || currentAnswer.trim() === "") {
              showNotification("error", "Can't Add an Empty Card");
              return;
            }

            handleSaveCard({
              question: currentQuestion,
              answer: currentAnswer,
              id: editingCard?.id || nanoid(),
            });
          }}
          text={editingCard ? "Update Card" : "Add Card"}
          className={styles.addCard}
          size="lg"
          loading={isLoading}
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
