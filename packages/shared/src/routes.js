// Breve spiegazione:
// Questo file contiene le route logiche condivise tra server e client.
// Il backend valida le routeKey, il frontend le traduce in URL reali.
// Modificare qui significa aggiornare entrambe le app con un solo commit.

export const routeMap = {
  home: "/",
  profilo: "/profilo",
  corsi: "/corsi",
  contatti: "/contatti"
};

export const allowedRouteKeys = Object.keys(routeMap);
