import styles from "./DecksListItem.module.css";
import Button from "./Button";
import { Link } from "react-router-dom";
function DecksListItem({
  setIsModalOpen,
  deckId,
  name,
  deleteDeck,
  setEditingInfo,
}) {
  async function handleEditName() {
    setIsModalOpen(true);
    setEditingInfo({ isEditing: true, deckId: deckId });
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
      <h2>{name}</h2>
      <div className={styles.buttonsContainer}>
        <Link to={`/decks/${deckId}`}>
          <Button
            className={styles.iconBtn}
            bgColor="#FAFBFC"
            color="#24292E"
            size="md"
            text="Add Cards"
          />
        </Link>
        <select
          onChange={handleMenuChange}
          className={styles.menuSelect}
          defaultValue=""
        >
          <option value="" disabled hidden>
            ⁝
          </option>
          <option value="edit">Edit</option>
          <option value="delete">Delete</option>
        </select>
      </div>
    </li>
  );
}

export default DecksListItem;
