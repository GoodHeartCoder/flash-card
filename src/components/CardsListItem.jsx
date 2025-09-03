import styles from "./CardsListItem.module.css";

function CardsListItem({ card }) {
  return (
    <tr className={styles.row}>
      <td dir="auto">{card.question}</td>
      {/* <td dir="auto">{card.answer}</td> */}
    </tr>
  );
}

export default CardsListItem;
