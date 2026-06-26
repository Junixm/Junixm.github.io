import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves a project site from https://<user>.github.io/<repo>/,
// so the app must be built with a matching base path. Override with the
// VITE_BASE env var (the CI workflow sets it to "/<repo>/" automatically).
// For a user/org page (repo named <user>.github.io) set VITE_BASE=/.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
