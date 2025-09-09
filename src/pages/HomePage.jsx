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
  const [EditingInfo, setEditingInfo] = useState({
    isEditing: false,
    deckId: "",
  });

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
      name: deckName.replace(/<[^>]+>/g, ""),
      cards: [],
    };

    try {
      if (!EditingInfo.isEditing) {
        const res = await fetch("http://localhost:9000/decks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deckData),
        });
      } else {
        // this is for editing the deck name
        const res = await fetch(
          `http://localhost:9000/decks/${EditingInfo.deckId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: deckName.replace(/<[^>]+>/g, "") }),
          }
        );
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error response:", errorText);
          throw new Error("Failed to create deck");
        }
      }

      getDecks();
      setDeckName("");
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsModalOpen((isModalOpen) => !isModalOpen);
    }
  }

  async function deleteDeck(deckId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deck?"
    );
    if (!confirmed) return;
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
      {decks.length === 0 ? (
        <div
          style={{
            display: "grid",
            placeContent: "center",
            padding: "2rem",
            fontSize: "1.4rem",
            color: "#666",
          }}
        >
          Create a Deck to start studying 📚
        </div>
      ) : (
        <StudySessionForm decks={decks} />
      )}
      <DecksList
        decks={decks}
        deleteDeck={deleteDeck}
        setIsModalOpen={setIsModalOpen}
        setEditingInfo={setEditingInfo}
      />
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
