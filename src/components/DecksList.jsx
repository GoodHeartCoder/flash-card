import DecksListItem from "./DecksListItem";
import styles from "./DecksList.module.css";

function DecksList({ setIsModalOpen, decks, deleteDeck, setEditingInfo }) {
  return (
    <ul className={styles.listContainer}>
      {decks.map((deck) => (
        <DecksListItem
          deckId={deck.id}
          name={deck.name}
          key={deck.id}
          deleteDeck={deleteDeck}
          setIsModalOpen={setIsModalOpen}
          setEditingInfo={setEditingInfo}
        />
      ))}
    </ul>
  );
}

export default DecksList;
