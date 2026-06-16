// Breve spiegazione:
// Server Express che espone POST /api/chat.
// Riceve il messaggio dell'utente e risponde con uno schema strutturato.
// Il campo 'action' dice al client cosa fare: rispondere o navigare.

import express from "express";
import genericAgent from "./ai/agents/generic.js";
import { HumanMessage } from "langchain";

const app = express();

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Messaggio non valido" });
  }


  const aiResponse = await genericAgent.invoke({
    messages: [
      new HumanMessage(message)
    ]
  });

  aiResponse.messages.forEach((m, i) =>
    console.log(i, m.constructor.name, m.usage_metadata)
  );
  
  const result = aiResponse.structuredResponse;

  res.json(result);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server attivo su http://localhost:${PORT}`);
});
