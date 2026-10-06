import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ⚠️ Precisa bater EXATAMENTE com o nome do repositório no GitHub.
// O repositório será: github.com/SEU_USUARIO/investhubplus
const REPO = 'investhubplus';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${REPO}/` : '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});