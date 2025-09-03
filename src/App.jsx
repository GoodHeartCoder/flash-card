import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/HomePage";
import DeckPage from "../src/pages/DeckPage";
import Header from "./components/Header";
import StudyPage from "./pages/StudyPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/decks/:id" element={<DeckPage />} />
          <Route path="/study/:id" element={<StudyPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
