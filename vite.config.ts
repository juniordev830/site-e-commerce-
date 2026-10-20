import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Em desenvolvimento, /api é encaminhado para a API: o navegador enxerga uma única origem
    proxy: { "/api": "http://localhost:3333" },
  },
});
