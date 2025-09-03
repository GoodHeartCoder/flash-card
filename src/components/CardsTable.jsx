import styles from "./CardsTable.module.css";
import CardsTableItem from "./CardsTableItem";
function CardsTable({ currentDeck }) {
  return (
    <div className={styles.scrollContainer}>
      <table className={styles.cardsTable}>
        <thead>
          <tr>
            <th className={styles.title}>Cards</th>
          </tr>
        </thead>
        <tbody>
          {currentDeck.cards?.map((card) => (
            <CardsTableItem
              card={{
                ...card,
                question: card.question.replace(/<[^>]+>/g, ""),
              }}
              key={card.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CardsTable;
