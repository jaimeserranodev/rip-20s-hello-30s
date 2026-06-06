import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/rip-20s-hello-30s/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
