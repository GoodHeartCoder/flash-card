import styles from "./NewDeckModal.module.css";
import Button from "./Button";
import useDecks from "../contexts/useDecks";
function NewDeckModal() {
  const { setIsModalOpen, deckName, setDeckName, upsertDeck } = useDecks();
  return (
    <div className={`${styles.NewDeckModal} modal-open`}>
      <div className={styles.ModalBox}>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="name you deck"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            required={true}
            maxLength="50"
          />
          <div>
            <Button text="OK" size="lg" onClick={() => upsertDeck()} />
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
