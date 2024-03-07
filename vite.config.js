import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/React-perusteet-osa2-puhelinluettelo",
  plugins: [react()],
})
