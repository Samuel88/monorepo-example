// Breve spiegazione:
// Server Express che espone POST /api/chat.
// Riceve il messaggio dell'utente e risponde con uno schema strutturato.
// Il campo 'action' dice al client cosa fare: rispondere o navigare.

import express from "express";
import { routeMap, allowedRouteKeys } from "@myorg/shared/routes";
import { ChatResponseSchema } from "@myorg/shared/chat-schema";

const app = express();
app.use(express.json());

app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Messaggio non valido" });
  }

  const lowerMsg = message.toLowerCase();

  // Controlla se il messaggio contiene una delle routeKey consentite
  // In produzione qui ci sarebbe la chiamata al modello LLM
  const matchedKey = allowedRouteKeys.find((key) => lowerMsg.includes(key));

  let response;

  if (matchedKey) {
    response = {
      message: `Ti porto nella pagina "${matchedKey}".`,
      action: "navigate",
      routeKey: matchedKey
    };
  } else {
    response = {
      message: `Hai scritto: "${message}". Questa è una risposta simulata del server.`,
      action: "reply",
      routeKey: null
    };
  }

  // Validazione con Zod prima di rispondere
  const parsed = ChatResponseSchema.parse(response);

  res.json(parsed);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
  console.log("Route disponibili:", routeMap);
});
