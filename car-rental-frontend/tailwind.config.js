/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        secondary: '#0F172A',
        accent: '#F1F5F9',
      },
    },
  },
  plugins: [],
}
