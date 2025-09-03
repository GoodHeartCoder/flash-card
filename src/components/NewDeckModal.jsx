import styles from "./NewDeckModal.module.css";
import Button from "./Button";
function NewDeckModal({
  handleAddDeck,
  deckName,
  setDeckName,
  setIsModalOpen,
}) {
  return (
    <div className={`${styles.NewDeckModal} modal-open`}>
      <div className={styles.ModalBox}>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="name you deck"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
          <div>
            <Button
              text="Create Deck"
              size="lg"
              onClick={() => handleAddDeck()}
            />
            <Button
              text="Cancel"
              size="lg"
              onClick={() => setIsModalOpen((isModalOpen) => !isModalOpen)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewDeckModal;
