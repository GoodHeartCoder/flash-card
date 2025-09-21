import styles from "./CardsTableItem.module.css";
import Button from "./Button";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import useDecks from "../contexts/useDecks";

function CardsTableItem({
  card,
  deckId,
  setCurrentAnswer,
  setCurrentQuestion,
  getCurrentDeck,
  setEditingCard,
  editingCard,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showNotification } = useDecks();

  async function handleDeleteCard() {
    setIsDeleting(true);
    try {
      // Get current deck
      const deckRes = await fetch(`http://localhost:9000/decks/${deckId}`);
      const currentDeck = await deckRes.json();

      // Filter out the card to delete
      const updatedCards = currentDeck.cards.filter((c) => c.id !== card.id);

      // Update the deck with filtered cards
      const res = await fetch(`http://localhost:9000/decks/${deckId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: updatedCards }),
      });

      if (res.ok) {
        await getCurrentDeck(); // Refresh the deck data
        showNotification("success", "Card deleted successfully!", true);
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      showNotification("error", "Failed to delete card", true);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEditCard() {
    setCurrentAnswer(card.answer);
    setCurrentQuestion(card.question);
    setEditingCard(card);
  }
  return (
    <tr className={styles.row}>
      <td dir="auto">
        {card.question}
        <div className={styles.buttonContainer}>
          {isDeleting ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
              className={styles.LoadingSpinner}
            >
              <LoadingSpinner size="sm" color="red" />
            </div>
          ) : (
            <>
              {" "}
              <Button
                text="Edit"
                size="sm"
                bgColor="#007bff"
                color="white"
                onClick={handleEditCard}
                disabled={editingCard ? true : false}
                className={editingCard ? styles.disable : ""}
              />
              <Button
                text="Delete"
                size="sm"
                bgColor="#dc3545"
                color="white"
                onClick={handleDeleteCard}
                disabled={editingCard ? true : false}
                className={editingCard ? styles.disable : ""}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default CardsTableItem;
