// Breve spiegazione:
// Il proxy di Vite inoltra tutte le richieste /api al backend Express.
// Così in sviluppo puoi usare fetch('/api/chat') senza scrivere l'host completo.
// In produzione questa configurazione non serve: si usa un reverse proxy reale.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true
      }
    }
  }
});
