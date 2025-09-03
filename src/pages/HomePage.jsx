import styles from "./HomePage.module.css";
import DecksList from "../components/DecksList";
import StudySessionForm from "../components/StudySessionForm";
import Button from "../components/Button";
import NewDeckModal from "../components/NewDeckModal";
import { useEffect, useState } from "react";
function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [decks, setDecks] = useState([]);

  async function getDecks() {
    const res = await fetch(`http://localhost:9000/decks`);
    const data = await res.json();
    setDecks(data);
  }

  useEffect(function getData() {
    getDecks();
  }, []);

  async function handleAddDeck() {
    const deckData = {
      name: deckName,
      cards: [],
    };

    try {
      const res = await fetch("http://localhost:9000/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deckData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to create deck");
      }

      // const result = await res.json();
      getDecks();
      setDeckName("");
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsModalOpen((isModalOpen) => !isModalOpen);
    }
  }

  async function deleteDeck(deckId) {
    try {
      const res = await fetch(`http://localhost:9000/decks/${deckId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete deck");

      console.log("Deck deleted successfully");
      getDecks();
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  }

  return (
    <section className={styles.container}>
      <StudySessionForm decks={decks} />
      <DecksList decks={decks} deleteDeck={deleteDeck} />
      <Button
        text="+"
        size="xl"
        borderRadius="30%"
        className="floatingButton"
        onClick={() => {
          setIsModalOpen((isModalOpen) => !isModalOpen);
        }}
      />
      {isModalOpen && (
        <NewDeckModal
          setIsModalOpen={setIsModalOpen}
          deckName={deckName}
          setDeckName={setDeckName}
          handleAddDeck={handleAddDeck}
        />
      )}
    </section>
  );
}

export default HomePage;
