/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'monospace'],
        univers: ['"Plus Jakarta Sans"', 'sans-serif'],
        helvetica: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        obsidian: {
          950: '#030712',
          900: '#070e1e',
          850: '#0a1329',
          800: '#0f1a36',
        },
      },
    },
  },
  plugins: [],
}
