import styles from "./CardsTableItem.module.css";

function CardsTableItem({ card }) {
  return (
    <tr className={styles.row}>
      <td dir="auto">{card.question}</td>
    </tr>
  );
}

export default CardsTableItem;
