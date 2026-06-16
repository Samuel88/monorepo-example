// Breve spiegazione:
// Questo schema Zod definisce la forma della risposta del backend.
// Viene importato sia dal server (per validare) che dal client (per tipizzare).
// Mantenendolo qui evitiamo che server e client abbiano schemi diversi.

import { z } from "zod";

export const ChatResponseSchema = z.object({
  // Il testo da mostrare in chat all'utente
  message: z.string(),
  // 'reply' = risposta normale, 'navigate' = il modello vuole cambiare pagina
  action: z.enum(["reply", "navigate"]),
  // La chiave logica della route (null se action === 'reply')
  routeKey: z.enum(["home", "profilo", "corsi", "contatti"]).nullable()
});
