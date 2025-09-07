import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  base: './', // garante que o build funcione em qualquer caminho
});
