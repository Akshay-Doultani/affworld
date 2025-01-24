import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Make sure this matches where your hosting platform expects files
  },
  server: {
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://localhost:5000',
    },
  },
});
