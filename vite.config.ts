import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal Vite config — just the React plugin. Keeps the dependency surface small.
export default defineConfig({
  plugins: [react()],
  // Relative asset paths: the built app works from a root domain, a subpath
  // (e.g. GitHub Pages project sites), or even file:// — no routing to break.
  base: './',
  server: {
    // Listen on all addresses (IPv4 + IPv6), not just IPv6 localhost. This makes
    // http://localhost:5173 reliably reachable in any browser, and also prints a
    // Network URL you can open on your phone (same Wi-Fi).
    host: true,
    port: 5173,
  },
})
