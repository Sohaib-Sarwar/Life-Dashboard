import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const vite_url = process.env.VITE_URL || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: vite_url,
        changeOrigin: true,
      }
    }
  }
})