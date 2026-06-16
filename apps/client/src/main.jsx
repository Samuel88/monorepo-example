// Breve spiegazione:
// BrowserRouter abilita il routing nel browser per tutta l'app React.
// Deve avvolgere l'intera applicazione per permettere l'uso di useNavigate.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
