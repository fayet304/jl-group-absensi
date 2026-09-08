import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT (GitHub Pages):
// Ganti '/NAMA-REPO/' di bawah dengan nama repository GitHub kamu,
// contoh: jika repo-nya https://github.com/username/jl-group-absensi
// maka base: '/jl-group-absensi/'
export default defineConfig({
  plugins: [react()],
  base: '/jl-group-absensi/',
})
