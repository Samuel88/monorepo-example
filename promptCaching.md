# Miniguida: ottimizzazione token con Anthropic Claude

## Come funzionano i token in una chiamata

Ogni richiesta a Claude consuma token su quattro fronti:

| Componente | Nota |
|---|---|
| System prompt | Ripetuto integralmente ad ogni chiamata |
| History dei messaggi | Cresce ad ogni turno se passata al modello |
| Messaggio utente | Variabile |
| Risposta del modello (output) | Fatturato separatamente, sempre più costoso |

---

## Strategia 1 — Prompt caching (–90% sui token in input cachati)

Anthropic permette di marcare parti del contesto con `cache_control: { type: "ephemeral" }`. Alla prima chiamata i token vengono "scritti" in cache (`cache_creation_input_tokens`); nelle chiamate successive vengono riletti al 10% del costo normale (`cache_read_input_tokens`).

### Soglie minime obbligatorie

Il contenuto da cachare deve superare una lunghezza minima, altrimenti Anthropic lo ignora silenziosamente e i contatori restano a 0:

| Modello | Token minimi |
|---|---|
| Claude Haiku 4.5 | 2048 |
| Claude Sonnet 4.x / Opus 4.x | 1024 |

### TTL della cache

| TTL | Costo aggiuntivo |
|---|---|
| 5 minuti (default) | nessuno |
| 1 ora | piccolo sovrapprezzo sulla creazione |

```js
// cache_control con TTL esteso
"cache_control": { "type": "ephemeral", "ttl": "1h" }
```

### Quando conviene

- **System prompt lungo** (istruzioni dettagliate, esempi few-shot, documentazione): supera la soglia una volta e ogni chiamata successiva paga solo il 10%.
- **Conversazioni multi-turno** con history passata ad ogni richiesta: i messaggi precedenti vengono cachati automaticamente dal middleware, le nuove chiamate costano molto meno.

### Quando NON si attiva

- System prompt sotto la soglia minima (caso tipico con prompt brevi).
- Chiamate singole senza history (non c'è contesto ripetuto da cachare).

### Come verificare se la cache funziona

Controlla `usage_metadata` sul messaggio di risposta:

```js
// in server.js
const msg = aiResponse.messages.find(m => m.usage_metadata?.input_tokens > 0);
console.log(msg.usage_metadata);
// { input_tokens, output_tokens, total_tokens }

console.log(msg.response_metadata?.usage);
// { input_tokens, output_tokens,
//   cache_creation_input_tokens,  ← > 0 alla prima chiamata
//   cache_read_input_tokens }     ← > 0 dalle chiamate successive
```

---

## Strategia 2 — Gestione della history (evita token inutili)

Passare l'intera history ad ogni turno fa crescere il costo linearmente. Approcci per contenerlo:

- **Finestra scorrevole**: tieni solo gli ultimi N messaggi.
- **Riassunto periodico**: ogni K turni chiedi al modello un riassunto, sostituisci la history con quello.
- **Nessuna history** (chiamate stateless): il più economico, ma il modello non ricorda i turni precedenti.

---

## Strategia 3 — Message Batches API (–50% su input e output)

Per operazioni **non real-time** (elaborazioni batch, test, pipeline offline), il [Batches API](https://docs.anthropic.com/en/api/creating-message-batches) processa le richieste in modo asincrono entro 24 ore al 50% del costo standard.

Non adatto alla chat sincrona, ma combinato con la cache si può arrivare a –95% sul costo totale dei token in input.

---

## Riepilogo costi relativi

| Scenario | Costo input |
|---|---|
| Chiamata normale | 100% |
| Token letti dalla cache | ~10% |
| Batch API | 50% |
| Batch API + cache read | ~5% |

---

## Setup nel progetto

Il middleware è configurato in [apps/server/src/ai/agents/generic.js](apps/server/src/ai/agents/generic.js):

```js
const cachingMiddleware = anthropicPromptCachingMiddleware({
    ttl: "5m",
    minMessagesToCache: 1,
    enableCaching: true,
    unsupportedModelBehavior: "warn"
});
```

È già attivo. Diventerà efficace quando il system prompt supererà la soglia minima oppure quando verrà introdotta la gestione della history multi-turno.
