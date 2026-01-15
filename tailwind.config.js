/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        univers: ['Univers', 'Helvetica', 'Arial', 'sans-serif'],
        helvetica: ['Helvetica', 'Arial', 'sans-serif'],
        sans: ['Univers', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
