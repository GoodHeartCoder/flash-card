import styles from "./StudySessionForm.module.css";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import useDecks from "../contexts/useDecks";
function StudySessionForm() {
  const [selectedDeckId, setSelectedDeckId] = useState("");
  const [studyMode, setStudyMode] = useState("");

  const { decks } = useDecks();
  return (
    <form className={styles.formContainer}>
      <legend>Study Options</legend>
      <fieldset>
        <label>Choose the Deck you want to Study:</label>
        <select
          value={selectedDeckId}
          onChange={(e) => setSelectedDeckId(e.target.value)}
          defaultValue=""
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
        <label>Select the Study mode you want:</label>
        <select
          value={studyMode}
          onChange={(e) => setStudyMode(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled hidden>
            select study mode
          </option>
          <option value="random">random cards</option>
          <option value="spaced">spaced repetition</option>
          <option value="all">all deck</option>
        </select>
      </fieldset>
      <Link to={`/study/${selectedDeckId}?mode=${studyMode}`}>
        <Button
          text="Start Studying"
          className={styles.formBtn}
          disabled={
            studyMode === "" ||
            selectedDeckId === "" ||
            decks.find((deck) => deck.id === Number(selectedDeckId)).cards
              .length === 0
              ? true
              : false
          }
        />
      </Link>
    </form>
  );
}

export default StudySessionForm;
