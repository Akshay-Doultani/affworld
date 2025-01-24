import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get the environment variable for the backend URL
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/feed': API_URL,  // This will point to the correct backend based on the environment
    },
  },
})
