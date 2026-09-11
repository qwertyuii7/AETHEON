/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: 'var(--color-ivory)',
        terracotta: 'var(--color-terracotta)',
        aegean: 'var(--color-aegean)',
        gold: 'var(--color-gold)',
        ink: 'var(--color-ink)',
      }
    },
  },
  plugins: [],
}
