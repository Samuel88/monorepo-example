# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Panoramica

Monorepo React + Express con **pnpm workspaces**. Dimostra una chat nell'header che, oltre a rispondere in linguaggio naturale, può triggerare navigazione React Router tramite backend.

## Comandi principali

```bash
pnpm install                  # installa tutte le dipendenze del monorepo

pnpm dev:server               # avvia Express su http://localhost:3001 (con --watch)
pnpm dev:client               # avvia Vite su http://localhost:5173

pnpm build:client             # build produzione del client
pnpm start:server             # avvia il server senza --watch
```

Aggiungere dipendenze a un package specifico:
```bash
pnpm add <pkg> --filter @myorg/client
pnpm add <pkg> --filter @myorg/server
pnpm add <pkg> --filter @myorg/shared
```

## Architettura

```
apps/client/   → @myorg/client   (React 19 + Vite 6 + React Router 7)
apps/server/   → @myorg/server   (Express 5)
packages/shared/ → @myorg/shared (libreria condivisa, nessun framework)
```

### Flusso dati chat

1. `HeaderChat.jsx` invia `POST /api/chat` con il messaggio dell'utente.
2. In sviluppo Vite fa da proxy: `/api/*` → `http://localhost:3001` (configurato in `vite.config.js`).
3. Il server (`server.js`) analizza il messaggio, costruisce una risposta e la valida con `ChatResponseSchema` (Zod) prima di risponderla.
4. Il client riceve `{ message, action, routeKey }`: se `action === "navigate"` usa `useNavigate()` di React Router per spostarsi sulla rotta corrispondente.

### Package condiviso `@myorg/shared`

Esporta due entry point (definiti in `exports` nel suo `package.json`):

- `@myorg/shared/routes` — `routeMap` e `allowedRouteKeys`: le chiavi logiche delle route (`home`, `profilo`, `corsi`, `contatti`). **Unica fonte di verità** usata sia dal server per validare le intenzioni dell'LLM, sia dal client per risolvere la URL effettiva.
- `@myorg/shared/chat-schema` — `ChatResponseSchema`: schema Zod della risposta del backend, importato dal server (per validare prima di rispondere) e disponibile al client per la tipizzazione.

Aggiungere una nuova pagina richiede di aggiornare `routeMap` in `packages/shared/src/routes.js`, la `Route` in `App.jsx` e (se necessario) lo schema `routeKey` in `chat-schema.js`.

## Ottimizzazione token

Per le strategie di risparmio token (prompt caching, gestione history, Batch API) vedi [promptCaching.md](promptCaching.md).

Il middleware `anthropicPromptCachingMiddleware` è già attivo in `apps/server/src/ai/agents/generic.js`. Si attiva automaticamente quando il system prompt supera le 2048 token (Haiku) o 1024 (Sonnet/Opus), oppure quando si passa la history multi-turno nelle richieste.
