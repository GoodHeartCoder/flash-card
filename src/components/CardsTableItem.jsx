import styles from "./CardsTableItem.module.css";

function CardsTableItem({
  card,
  deckId,
  setCurrentAnswer,
  setCurrentQuestion,
}) {
  async function handleDeleteCard() {
    const res = await fetch(
      `http://localhost:9000/decks/${deckId}/cards/${card.id}`,
      {
        method: "DELETE",
      }
    );
  }
  return (
    <tr className={styles.row}>
      <td dir="auto">{card.question}</td>
    </tr>
  );
}

export default CardsTableItem;
