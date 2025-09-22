import styles from "./DecksListItem.module.css";
import Button from "./Button";
import { Link } from "react-router-dom";
import useDecks from "../contexts/useDecks";
function DecksListItem({
  deckId,
  name,
  deleteDeck,
  newCardsCount,
  dueCardsCount,
}) {
  const { setIsModalOpen, setEditingDeckId } = useDecks();

  async function handleEditName() {
    setIsModalOpen(true);
    setEditingDeckId(deckId);
  }
  function handleMenuChange(e) {
    const value = e.target.value;
    if (value === "edit") {
      handleEditName();
    } else if (value === "delete") {
      deleteDeck(deckId);
    }
    // Reset the select to default
    e.target.value = "";
  }
  return (
    <li className={styles.container}>
      <div className={styles.content}>
        <div className={styles.deckInfo}>
          <h2 className={styles.deckTitle}>{name}</h2>
          <div className={styles.cardCounts}>
            <div className={styles.countItem}>
              <span className={styles.countLabel}>New</span>
              <span className={`${styles.countValue} ${styles.newCards}`}>
                {newCardsCount}
              </span>
            </div>
            <div className={styles.countItem}>
              <span className={styles.countLabel}>Due</span>
              <span className={`${styles.countValue} ${styles.dueCards}`}>
                {dueCardsCount}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Link to={`/decks/${deckId}`} className={styles.addCardsLink}>
            <Button
              className={styles.iconBtn}
              bgColor="#007bff"
              color="#ffffff"
              size="md"
              text="Add Cards"
            />
          </Link>
          <select
            onChange={handleMenuChange}
            className={styles.menuSelect}
            defaultValue=""
            aria-label="Deck options"
          >
            <option value="" disabled hidden>
              •••
            </option>
            <option value="edit">Edit</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      </div>
    </li>
  );
}

export default DecksListItem;
