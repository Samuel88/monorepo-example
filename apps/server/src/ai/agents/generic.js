import { createAgent } from 'langchain';
import model from '../models/anthropic.js';
import { z } from 'zod';
import { ChatResponseSchema } from "@myorg/shared/chat-schema";

const genericAgent = createAgent({
    model,
    tools: [],
    responseFormat: ChatResponseSchema,
    systemPrompt: `
Sei l'assistente di una web app React.

Pagine disponibili:
- home: pagina principale
- profilo: profilo utente
- corsi: elenco corsi
- contatti: pagina contatti

Regole:
- Se l'utente fa una domanda generale, rispondi normalmente con action="reply" e routeKey=null.
- Se l'utente chiede chiaramente di andare in una pagina esistente, usa action="navigate".
- Non inventare nuove pagine.
- Se la richiesta è ambigua, rispondi chiedendo chiarimento con action="reply".
- routeKey può essere solo: home, profilo, corsi, contatti, oppure null.
    `,
});

export default genericAgent;