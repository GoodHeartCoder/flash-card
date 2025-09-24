import { useState } from "react";

import { DecksContext } from "./useDecks";
import { countNewCards, countDueCards } from "../utils/CardsCounter";

function DecksProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decks, setDecks] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [notification, setNotification] = useState({
    type: null,
    message: "",
    isVisible: false,
  });

  function showNotification(type, message, isVisible = true) {
    setNotification({ type, message, isVisible });
  }

  async function upsertDeck() {
    const cleanDeckName = deckName.replace(/<[^>]+>/g, "");

    // Check if a deck with this name already exists
    const existingDeck = decks.find(
      (deck) => deck.name.toLowerCase() === cleanDeckName.toLowerCase()
    );

    if (existingDeck && existingDeck.id !== editingDeckId) {
      showNotification("error", "A deck with this name already exists");
      setIsModalOpen(false);
      return;
    }

    const deckData = {
      name: cleanDeckName,
      cards: [],
      newCardsCount: 0,
      dueCardsCount: 0,
    };

    try {
      let ok, errorText;
      if (editingDeckId === null) {
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
          `http://localhost:9000/decks/${editingDeckId}`,
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

      await getDecks();
      showNotification(
        "success",
        `${editingDeckId ? "Edited" : "Created"} Deck Successfully.`
      );
      setDeckName("");
      setEditingDeckId(null);
    } catch (error) {
      console.error("Fetch error:", error);
      showNotification(
        "error",
        `Failed to ${
          editingDeckId ? "Edit" : "Create"
        } deck. check your internet connection`
      );
    } finally {
      setIsModalOpen((isModalOpen) => !isModalOpen);
    }
  }

  async function getDecks() {
    try {
      const res = await fetch(`http://localhost:9000/decks`);
      const data = await res.json();

      // Update counts for each deck
      const updatedDecks = data.map((deck) => ({
        ...deck,
        newCardsCount: countNewCards(deck),
        dueCardsCount: countDueCards(deck),
      }));

      setDecks(updatedDecks);

      // Update the counts in the backend
      await Promise.all(
        updatedDecks.map((deck) =>
          fetch(`http://localhost:9000/decks/${deck.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              newCardsCount: deck.newCardsCount,
              dueCardsCount: deck.dueCardsCount,
            }),
          })
        )
      );
    } catch (error) {
      console.error("Error fetching decks:", error);
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
      await getDecks();
      showNotification("success", "Deck deleted successfully");
    } catch (error) {
      showNotification(
        "error",
        "Failed to delete deck. check your internet connection"
      );
      console.error("Error deleting deck:", error);
    }
  }

  const value = {
    isModalOpen,
    setIsModalOpen,
    decks,
    setDecks,
    getDecks,
    editingDeckId,
    setEditingDeckId,
    upsertDeck,
    deleteDeck,
    deckName,
    setDeckName,
    notification,
    showNotification,
  };

  return (
    <DecksContext.Provider value={value}>{children}</DecksContext.Provider>
  );
}

export default DecksProvider;
