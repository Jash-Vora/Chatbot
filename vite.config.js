import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path-browserify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      OPEN_AI_API_KEY:'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',
    }
  },
  resolve: {
    alias: {
      path: "path-browserify",
    },
  },

})
