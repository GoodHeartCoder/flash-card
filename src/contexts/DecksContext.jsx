import { useState } from "react";

import { DecksContext } from "./useDecks";

function DecksProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decks, setDecks] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [EditingInfo, setEditingInfo] = useState({
    isEditing: false,
    deckId: "",
  });

  async function upsertDeck() {
    const deckData = {
      name: deckName.replace(/<[^>]+>/g, ""),
      cards: [],
    };

    try {
      let ok, errorText;
      if (!EditingInfo.isEditing) {
        const res = await fetch("http://localhost:9000/decks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deckData),
        });
        ok = res.ok;
        errorText = await res.text();
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
        ok = res.ok;
        errorText = await res.text();
      }
      if (!ok) {
        console.error("Error response:", errorText);
        throw new Error("Failed to create deck");
      }

      getDecks();
      setDeckName("");
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsModalOpen((isModalOpen) => !isModalOpen);
    }
  }

  async function getDecks() {
    const res = await fetch(`http://localhost:9000/decks`);
    const data = await res.json();
    setDecks(data);
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

  const value = {
    isModalOpen,
    setIsModalOpen,
    decks,
    setDecks,
    getDecks,
    EditingInfo,
    setEditingInfo,
    upsertDeck,
    deleteDeck,
    deckName,
    setDeckName,
  };

  return (
    <DecksContext.Provider value={value}>{children}</DecksContext.Provider>
  );
}

export default DecksProvider;
