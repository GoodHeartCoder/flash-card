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
  editingCard,
  setEditingCard,
}) {
  const refA = useRef(null);
  const refB = useRef(null);
  const [activeRef, setActiveRef] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isUpdatingFromState, setIsUpdatingFromState] = useState(false);
  const isTypingRef = useRef(false); // Add this line

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
  async function handleSaveCard(card) {
    dispatch({ type: "setSubmitting", payload: true });

    try {
      const deckRes = await fetch(`http://localhost:9000/decks/${deckId}`);
      const currentDeck = await deckRes.json();

      let updatedCards;

      if (editingCard) {
        // Update existing card
        updatedCards = currentDeck.cards.map((c) =>
          c.id === editingCard.id ? { ...card, id: editingCard.id } : c
        );
      } else {
        // Add new card
        updatedCards = [...currentDeck.cards, card];
      }

      const res = await fetch(`http://localhost:9000/decks/${deckId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: updatedCards }),
      });

      // Reset form
      dispatch({ type: "resetEditor" });
      if (refA.current) refA.current.innerHTML = "<br>";
      if (refB.current) refB.current.innerHTML = "<br>";
      setCurrentQuestion("<br>");
      setCurrentAnswer("<br>");
      setEditingCard(null);

      getCurrentDeck();
    } catch {
      console.log();
    } finally {
      dispatch({ type: "setSubmitting", payload: false });
    }
  }

  function handleCancel() {
    dispatch({ type: "resetEditor" });
    if (refA.current) refA.current.innerHTML = "<br>";
    if (refB.current) refB.current.innerHTML = "<br>";
    setCurrentQuestion("<br>");
    setCurrentAnswer("<br>");
    setEditingCard(null);
  }

  useEffect(() => {
    if (isTypingRef.current) {
      isTypingRef.current = false; // Reset the flag
      return;
    }
    if (isUpdatingFromState) return;

    if (refA.current && refA.current.innerHTML !== currentQuestion) {
      refA.current.innerHTML = currentQuestion;
    }
    if (refB.current && refB.current.innerHTML !== currentAnswer) {
      refB.current.innerHTML = currentAnswer;
    }
  }, [currentQuestion, currentAnswer, isUpdatingFromState]);
  const handleInput = (e, setter) => {
    // Save cursor position before state update
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const startOffset = range ? range.startOffset : 0;
    const startContainer = range ? range.startContainer : null;
    const targetElement = e.currentTarget; // Store reference to DOM element

    isTypingRef.current = true;
    setter(targetElement.innerHTML);

    // Restore cursor position after React re-renders
    setTimeout(() => {
      if (startContainer && targetElement.contains(startContainer)) {
        const newRange = document.createRange();
        const newSelection = window.getSelection();

        try {
          newRange.setStart(
            startContainer,
            Math.min(startOffset, startContainer.textContent?.length || 0)
          );
          newRange.collapse(true);
          newSelection.removeAllRanges();
          newSelection.addRange(newRange);
        } catch (e) {
          // Fallback: place cursor at end
          newRange.selectNodeContents(targetElement); // Use stored reference
          newRange.collapse(false);
          newSelection.removeAllRanges();
          newSelection.addRange(newRange);
        }
      }
    }, 0);
  };

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
        onInput={(e) => handleInput(e, setCurrentQuestion)}
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
        onInput={(e) => handleInput(e, setCurrentAnswer)}
        onKeyDown={handleKeyDown}
        onKeyUp={checkFormattingState}
        onMouseUp={checkFormattingState}
        ref={refB}
      />
      <div className={styles.buttonGroup}>
        <Button
          onClick={() =>
            handleSaveCard({
              question: currentQuestion,
              answer: currentAnswer,
              id: editingCard?.id || nanoid(),
            })
          }
          text={editingCard ? "Update Card" : "Add Card"}
          className={styles.addCard}
          size="lg"
          disabled={state.isSubmitting}
        />
        {editingCard && (
          <Button
            onClick={handleCancel}
            text="Cancel"
            className={styles.cancelCard}
            size="lg"
            bgColor="#dc3545"
          />
        )}
      </div>
    </div>
  );
}

export default CardEditor;
