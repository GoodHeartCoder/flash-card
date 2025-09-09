import styles from "./CardEditor.module.css";
import { useEffect, useReducer, useRef, useState } from "react";
import { nanoid } from "nanoid";
import Button from "./Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TextItalicIcon,
  TextBoldIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";

const initialState = {
  bold: false,
  italic: false,
  underline: false,
  isSubmitting: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "updateFormatting":
      return {
        ...state,
        bold: action.payload.bold,
        italic: action.payload.italic,
        underline: action.payload.underline,
      };
    case "resetFormatting":
      return {
        ...initialState,
      };
    case "resetEditor":
      return { ...initialState };
    case "setSubmitting":
      return { ...state, isSubmitting: action.payload };
    default:
      throw new Error("Unknown action");
  }
}

function CardEditor({
  deckId,
  getCurrentDeck,
  currentQuestion,
  setCurrentQuestion,
  currentAnswer,
  setCurrentAnswer,
}) {
  const refA = useRef(null);
  const refB = useRef(null);
  const [activeRef, setActiveRef] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Function to check current formatting state
  const checkFormattingState = () => {
    if (!activeRef?.current) return;

    const bold = document.queryCommandState("bold");
    const italic = document.queryCommandState("italic");
    const underline = document.queryCommandState("underline");

    dispatch({
      type: "updateFormatting",
      payload: { bold, italic, underline },
    });
  };

  async function handleAddCard(card) {
    dispatch({ type: "resetEditor" });
    dispatch({ type: "setSubmitting", payload: true });
    if (refA.current) refA.current.innerHTML = "<br>";
    if (refB.current) refB.current.innerHTML = "<br>";

    try {
      // Get current deck
      const deckRes = await fetch(`http://localhost:9000/decks/${deckId}`);
      const currentDeck = await deckRes.json();

      // PATCH with new card
      const res = await fetch(`http://localhost:9000/decks/${deckId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: [...currentDeck.cards, card] }),
      });

      getCurrentDeck();
    } catch {
      console.log();
    } finally {
      dispatch({ type: "setSubmitting", payload: false });
    }
  }

  useEffect(() => {
    if (refA.current) refA.current.innerHTML = currentQuestion;
    if (refB.current) refB.current.innerHTML = currentAnswer;
  }, []);

  const applyFormatting = (command, value = null) => {
    if (activeRef?.current) {
      activeRef.current.focus();
      // Enable CSS styling for all commands
      document.execCommand("styleWithCSS", false, true);

      if (value) {
        document.execCommand(command, false, value);
      } else {
        document.execCommand(command);
      }

      // Update state after formatting is applied
      setTimeout(checkFormattingState, 0);
    }
  };

  const handleKeyDown = (e) => {
    const isMod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Enable CSS styling for all commands
    document.execCommand("styleWithCSS", false, true);

    if (isMod && key === "b") {
      e.preventDefault();
      applyFormatting("bold");
      return;
    }
    if (isMod && key === "i") {
      e.preventDefault();
      applyFormatting("italic");
      return;
    }
    if (isMod && key === "u") {
      e.preventDefault();
      applyFormatting("underline");
      return;
    }
    if (key === "enter") {
      e.preventDefault();
      return;
    }
    if (isMod && key === "enter") {
      e.preventDefault();
      // handleAddCard();
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.btnsGroup}>
        <Button
          text={<HugeiconsIcon icon={TextBoldIcon} />}
          onClick={() => applyFormatting("bold")}
          {...(state.bold
            ? { bgColor: "#cce0ff", color: "#003366" }
            : { bgColor: "#007bff", color: "#fff" })}
        />
        <Button
          text={<HugeiconsIcon icon={TextItalicIcon} />}
          onClick={() => applyFormatting("italic")}
          {...(state.italic
            ? { bgColor: "#cce0ff", color: "#003366" }
            : { bgColor: "#007bff", color: "#fff" })}
        />
        <Button
          text={<HugeiconsIcon icon={TextUnderlineIcon} />}
          onClick={() => applyFormatting("underline")}
          {...(state.underline
            ? { bgColor: "#cce0ff", color: "#003366" }
            : { bgColor: "#007bff", color: "#fff" })}
        />
      </div>
      <div
        className={`${styles.questionField} ${styles.Field}`}
        contentEditable
        suppressContentEditableWarning
        dir="auto"
        onFocus={() => {
          setActiveRef(refA);
          checkFormattingState();
        }}
        onInput={setCurrentQuestion((e) => e.currentTarget.innerHTML)}
        onKeyDown={handleKeyDown}
        onKeyUp={checkFormattingState}
        onMouseUp={checkFormattingState}
        ref={refA}
      />
      <div
        className={`${styles.answerField} ${styles.Field}`}
        contentEditable
        suppressContentEditableWarning
        dir="auto"
        onFocus={() => {
          setActiveRef(refB);
          checkFormattingState();
        }}
        onInput={setCurrentAnswer((e) => e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={checkFormattingState}
        onMouseUp={checkFormattingState}
        ref={refB}
      />
      <Button
        onClick={() =>
          handleAddCard({
            question: currentQuestion,
            answer: currentAnswer,
            id: nanoid(),
          })
        }
        text="Add Card"
        className={styles.addCard}
        size="lg"
        disabled={state.isSubmitting}
      />
    </div>
  );
}

export default CardEditor;
