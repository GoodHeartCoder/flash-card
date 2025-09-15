import styles from "./HomePage.module.css";
import DecksList from "../components/DecksList";
import StudySessionForm from "../components/StudySessionForm";
import Button from "../components/Button";
import NewDeckModal from "../components/NewDeckModal";
import { useEffect } from "react";
import useDecks from "../contexts/useDecks";

function HomePage() {
  const { isModalOpen, setIsModalOpen, decks, getDecks, deleteDeck } =
    useDecks();

  useEffect(() => {
    getDecks();
  }, []);

  return (
    <section className={styles.container}>
      {decks.length === 0 ? (
        <div className={styles.noDecksMessage}>
          Create a Deck to start studying 📚
        </div>
      ) : (
        <StudySessionForm />
      )}
      <DecksList deleteDeck={deleteDeck} />
      <Button
        text="+"
        size="xl"
        borderRadius="30%"
        className="floatingButton"
        onClick={() => {
          setIsModalOpen((isModalOpen) => !isModalOpen);
        }}
      />
      {isModalOpen && <NewDeckModal />}
    </section>
  );
}

export default HomePage;
