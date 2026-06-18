// Pagina Home dell'applicazione.
// È la pagina mostrata sulla rotta "/" (vedi routeMap in packages/shared/src/routes.js
// e la relativa <Route> in App.jsx) e quella verso cui il backend della chat
// naviga quando l'azione restituita ha routeKey "home".
export default function HomePage() {
  return (
    <div>
      {/* Titolo della pagina */}
      <h1>🏠 Home</h1>
      {/* Testo introduttivo: indica all'utente che la chat nell'header
          può essere usata per spostarsi tra le pagine dell'app */}
      <p>Benvenuto nella Home. Usa la chat per navigare tra le pagine.</p>
    </div>
  );
}
