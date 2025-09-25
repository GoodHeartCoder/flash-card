import styles from "./CardEditor.module.css";
import { useRef } from "react";
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
  const { showNotification } = useDecks();
  const isSaving = useRef(false);

  async function handleSaveCard(card) {
    // Don't allow multiple saves at once
    if (isSaving.current) return;
    isSaving.current = true;

    // Create a copy of the card to avoid reference issues
    const cardToSave = { ...card };
    
    // Reset form immediately for better UX
    setCurrentQuestion("");
    setCurrentAnswer("");
    setEditingCard(null);

    // Show optimistic update notification
    showNotification("info", "Saving card...", false);

    // Save in the background
    saveCardToServer(cardToSave);
  }

  async function saveCardToServer(card) {
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

      // Refresh the deck data
      await getCurrentDeck();
      
      showNotification(
        "success",
        editingCard ? "Card updated successfully!" : "Card added successfully!",
        true
      );
    } catch (error) {
      console.error("Failed to save card:", error);
      showNotification("error", "Failed to save the card. Please try again.", true);
      // You might want to implement a retry mechanism here
    } finally {
      isSaving.current = false;
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
              interval: 1,
              repetition: 0,
              efactor: 2.5,
              nextReview: null,
              id: editingCard?.id || nanoid(),
            });
          }}
          text={editingCard ? "Update Card" : "Add Card"}
          className={styles.addCard}
          size="lg"
          loading={isSaving.current}
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
