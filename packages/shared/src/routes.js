// Breve spiegazione:
// Questo file contiene le route logiche condivise tra server e client.
// Il backend valida le routeKey, il frontend le traduce in URL reali.
// Modificare qui significa aggiornare entrambe le app con un solo commit.

export const routeMap = {
  home:      { path: "/",          description: "pagina principale dell'app" },
  profilo:   { path: "/profilo",   description: "profilo e dati dell'utente" },
  corsi:     { path: "/corsi",     description: "elenco dei corsi disponibili" },
  contatti:  { path: "/contatti",  description: "pagina di contatto" },
};

export const allowedRouteKeys = Object.keys(routeMap);
