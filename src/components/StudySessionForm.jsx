import styles from "./StudySessionForm.module.css";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import useDecks from "../contexts/useDecks";
function StudySessionForm() {
  const [selectedDeckId, setSelectedDeckId] = useState("");
  const [studyMode, setStudyMode] = useState("");
  const [cardCount, setCardCount] = useState("");
  const { decks, showNotification } = useDecks();

  return (
    <form className={styles.formContainer}>
      <legend>Study Options</legend>
      <fieldset>
        <div className={styles.deckSelection}>
          <label>Choose the Deck you want to Study:</label>
          <select
            value={selectedDeckId}
            onChange={(e) => setSelectedDeckId(e.target.value)}
          >
            <option value="" disabled hidden>
              select deck
            </option>
            {decks.map((deck) => (
              <option value={deck.id} key={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.modeSelection}>
          <label>Select the Study mode:</label>
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="random"
                name="studyMode"
                value="random"
                checked={studyMode === "random"}
                onChange={(e) => setStudyMode(e.target.value)}
              />
              <label htmlFor="random">Random Cards</label>
            </div>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="spaced"
                name="studyMode"
                value="spaced"
                checked={studyMode === "spaced"}
                onChange={(e) => setStudyMode(e.target.value)}
              />
              <label htmlFor="spaced">Spaced Repetition</label>
            </div>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="all"
                name="studyMode"
                value="all"
                checked={studyMode === "all"}
                onChange={(e) => setStudyMode(e.target.value)}
              />
              <label htmlFor="all">All Deck</label>
            </div>
          </div>
        </div>

        {studyMode === "random" && (
          <div className={styles.countSelection}>
            <label htmlFor="cardCount">Number of Cards:</label>
            <input
              type="number"
              id="cardCount"
              value={cardCount}
              onChange={(e) => setCardCount(e.target.value)}
              min="1"
              placeholder="Leave empty for all cards"
            />
          </div>
        )}
      </fieldset>
      <Link
        to={`/study/${selectedDeckId}?mode=${studyMode}${
          studyMode === "random" && cardCount ? `&count=${cardCount}` : ""
        }`}
      >
        <Button
          text="Start Studying"
          className={styles.formBtn}
          disabled={
            studyMode === "" ||
            selectedDeckId === "" ||
            decks?.find((deck) => deck.id === Number(selectedDeckId || 0)).cards
              .length === 0 ||
            (studyMode === "random" && cardCount && cardCount < 1)
          }
        />
      </Link>
    </form>
  );
}

export default StudySessionForm;
