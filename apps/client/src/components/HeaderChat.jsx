// Breve spiegazione:
// HeaderChat è il componente principale della chat.
// Dopo ogni risposta del backend controlla se c'è un'intenzione di navigazione.
// useNavigate() di React Router esegue il redirect in modo programmatico.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routeMap } from "@myorg/shared/routes";

export default function HeaderChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hook di React Router per la navigazione programmatica
  const navigate = useNavigate();

  async function handleSend() {
    if (!message.trim()) return;

    // Aggiunge il messaggio utente alla lista
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      // Chiama il backend Express tramite proxy Vite
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      // Il backend risponde con { message, action, routeKey }
      const data = await response.json();

      // Aggiunge la risposta del modello alla chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message }
      ]);

      // Se l'LLM vuole navigare e la routeKey è valida, esegui il redirect
      if (
        data.action === "navigate" &&
        data.routeKey &&
        routeMap[data.routeKey]?.path
      ) {
        navigate(routeMap[data.routeKey].path);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Errore nella comunicazione col server." }
      ]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  }

  function handleKeyDown(e) {
    // Invia con Enter (senza Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <header
      style={{
        background: "#f0f4f8",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem"
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>🤖 Chat Assistant</h2>

      {/* Lista messaggi */}
      <div
        style={{
          maxHeight: "150px",
          overflowY: "auto",
          marginBottom: "0.5rem",
          background: "#fff",
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ddd"
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#999", fontSize: "0.875rem" }}>
            Scrivi qualcosa per iniziare. Prova a scrivere "corsi", "profilo",
            "contatti" o "home".
          </p>
        )}
        {messages.map((msg, index) => (
          <p key={index} style={{ margin: "0.25rem 0" }}>
            <strong>{msg.role === "user" ? "Tu" : "AI"}:</strong> {msg.content}
          </p>
        ))}
      </div>

      {/* Input e bottone */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrivi un messaggio..."
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "..." : "Invia"}
        </button>
      </div>
    </header>
  );
}
