import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/andres844.github.io/',
  resolve: {
    extensions: ['.js', '.jsx']
  }
})