import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // 1. Import Tailwind v4 compiler
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 2. Add this: Forces relative asset paths so Render doesn't get 404s
  plugins: [
    react(),
    tailwindcss(), // 3. Inject Tailwind compiler plugin to process your styles
  ],

  server: {
    port: 5173,
    strictPort: true,
  },

  build: {
    outDir: 'dist',
  },

  resolve: {
    alias: {
      // 4. Fixed Alias path calculation using correct relative filesystem positioning
      '@': path.resolve(__dirname, './src'),
    },
  },
});