import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000"
    }
  },
// Lägg till koden nedanför för att konfigurera vart build ska lägga filerna
// och att build ska skriva över / tömma existerande filer
  build: {
    outDir: '../server/wwwroot',
    emptyOutDir: true,
  }
})
