/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        solio: {
          50: '#faf8f5',
          100: '#f2ede4',
          500: '#c8a882',
          900: '#2c1810',
        }
      }
    },
  },
  plugins: [],
}
