import DecksListItem from "./DecksListItem";
import styles from "./DecksList.module.css";
import useDecks from "../contexts/useDecks";

function DecksList({ deleteDeck }) {
  const { decks } = useDecks();
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
