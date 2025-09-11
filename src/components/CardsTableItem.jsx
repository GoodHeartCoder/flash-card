import styles from "./CardsTableItem.module.css";
import Button from "./Button";

function CardsTableItem({
  card,
  deckId,
  setCurrentAnswer,
  setCurrentQuestion,
  getCurrentDeck,
  setEditingCard,
}) {
  async function handleDeleteCard() {
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
        getCurrentDeck(); // Refresh the deck data
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  }

  function hadnleEditCard() {
    setCurrentAnswer(card.answer);
    setCurrentQuestion(card.question);
    setEditingCard(card);
  }
  return (
    <tr className={styles.row}>
      <td dir="auto">
        {card.question}
        <div className={styles.buttonContainer}>
          <Button
            text="Edit"
            size="sm"
            bgColor="#007bff"
            color="white"
            onClick={hadnleEditCard}
          />
          <Button
            text="Delete"
            size="sm"
            bgColor="#dc3545"
            color="white"
            onClick={handleDeleteCard}
          />
        </div>
      </td>
    </tr>
  );
}

export default CardsTableItem;
