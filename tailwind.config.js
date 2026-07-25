/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F8F9FD',
          100: '#E8E3FF',
          300: '#B388FF',
          400: '#A882FF',
          500: '#7B61FF',
          600: '#6B5AED',
          700: '#5646C7',
          accent: '#7B61FF',
          cyan: '#A882FF'
        },
        lightBg: '#F8F9FD',
        lightCard: '#FFFFFF',
        darkBg: '#090d16',
        darkCard: '#111726',
        darkBorder: 'rgba(255, 255, 255, 0.08)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(123, 97, 255, 0.35)',
        'cyan-glow': '0 0 25px -5px rgba(168, 130, 255, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
