# monorepo-example

Monorepo React + Express + Shared packages con **pnpm workspaces**.

Contiene una chat con LLM nell'header che può triggerare redirect React Router. Il backend usa `@langchain/anthropic` con prompt caching configurato — vedi [promptCaching.md](promptCaching.md) per la guida all'ottimizzazione dei token.

## Struttura

```
my-monorepo/
├─ apps/
│  ├─ client/       # React + Vite + React Router
│  └─ server/       # Express API
├─ packages/
│  └─ shared/       # Codice condiviso (routeMap, schema Zod)
├─ package.json
└─ pnpm-workspace.yaml
```

## Setup

```bash
pnpm install
```

## Avvio

```bash
# in due terminali separati
pnpm dev:server
pnpm dev:client
```

## Installare dipendenze

```bash
pnpm add react react-dom react-router-dom --filter @myorg/client
pnpm add -D vite @vitejs/plugin-react --filter @myorg/client
pnpm add express zod --filter @myorg/server
pnpm add zod --filter @myorg/shared
```
