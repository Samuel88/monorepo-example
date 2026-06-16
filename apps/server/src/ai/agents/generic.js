import { createAgent, anthropicPromptCachingMiddleware } from 'langchain';
import model from '../models/anthropic.js';
import { z } from 'zod';
import { ChatResponseSchema } from '@myorg/shared/chat-schema';
import { routeMap, allowedRouteKeys } from '@myorg/shared/routes';

const cachingMiddleware = anthropicPromptCachingMiddleware({
    ttl: "5m",              // "5m" o "1h" — default: "5m"
    minMessagesToCache: 1,  // minimo messaggi totali per attivare la cache — default: 3
    enableCaching: true,    // puoi disabilitarlo a runtime — default: true
    unsupportedModelBehavior: "warn"  // "warn" | "raise" | "ignore" — default: "warn"
});

const pageList = Object.entries(routeMap)
    .map(([key, { description }]) => `- ${key}: ${description}`)
    .join('\n');

const genericAgent = createAgent({
    model,
    tools: [],
    middleware: [
        cachingMiddleware
    ],
    responseFormat: ChatResponseSchema,
    systemPrompt: `
Sei l'assistente di una web app React.

Pagine disponibili:
${pageList}

Regole:
- Se l'utente fa una domanda generale, rispondi normalmente con action="reply" e routeKey=null.
- Se l'utente chiede chiaramente di andare in una pagina esistente, usa action="navigate".
- Non inventare nuove pagine.
- Se la richiesta è ambigua, rispondi chiedendo chiarimento con action="reply".
- routeKey può essere solo: ${allowedRouteKeys.join(', ')}, oppure null.
    `,
});

export default genericAgent;