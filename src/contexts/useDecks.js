import { createContext, useContext } from "react";
export const DecksContext = createContext();

export default function useDecks() {
  const context = useContext(DecksContext);

  if (context === undefined) {
    throw new Error("useDecks was used outside of the Decks Provider");
  }
  return context;
}
