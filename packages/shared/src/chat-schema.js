// Breve spiegazione:
// Questo schema Zod definisce la forma della risposta del backend.
// Viene importato sia dal server (per validare) che dal client (per tipizzare).
// Mantenendolo qui evitiamo che server e client abbiano schemi diversi.

import { z } from "zod";

export const ChatResponseSchema = z.object({
    message: z.string()
        .describe('Messaggio da mostrare nella chat'),
    action: z.enum(["reply", "navigate"])
        .describe('Azione da eseguire nel frontend'),
    routeKey: z.enum(["home", "profilo", "corsi", "contatti"])
        .nullable()
        .describe('Chiave della pagina, oppure null se non serve navigare')
});
