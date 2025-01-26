import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/my-app/', // リポジトリ名に置き換えてください
  plugins: [react()],
  define: {
    'process.env': process.env
  }
})
