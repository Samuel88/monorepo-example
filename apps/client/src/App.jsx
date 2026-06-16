// Breve spiegazione:
// App.jsx definisce il layout principale e le Route dell'applicazione.
// HeaderChat è presente in tutte le pagine perché sta fuori da <Routes>.

import { Routes, Route, Link } from "react-router-dom";
import HeaderChat from "./components/HeaderChat";
import HomePage from "./pages/HomePage";
import ProfiloPage from "./pages/ProfiloPage";
import CorsiPage from "./pages/CorsiPage";
import ContattiPage from "./pages/ContattiPage";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>

      {/* Header con chat LLM — visibile in tutte le pagine */}
      <HeaderChat />

      {/* Navigazione tra le pagine */}
      <nav style={{ margin: "1rem 0", display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/profilo">Profilo</Link>
        <Link to="/corsi">Corsi</Link>
        <Link to="/contatti">Contatti</Link>
      </nav>

      <hr />

      {/* Pagine dell'app */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profilo" element={<ProfiloPage />} />
        <Route path="/corsi" element={<CorsiPage />} />
        <Route path="/contatti" element={<ContattiPage />} />
      </Routes>
    </div>
  );
}
