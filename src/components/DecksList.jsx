import DecksListItem from "./DecksListItem";
import styles from "./DecksList.module.css";

function DecksList({ decks, deleteDeck }) {
  return (
    <ul className={styles.listContainer}>
      {decks.map((deck) => (
        <DecksListItem
          deckId={deck.id}
          name={deck.name}
          key={deck.id}
          deleteDeck={deleteDeck}
        />
      ))}
    </ul>
  );
}

export default DecksList;
