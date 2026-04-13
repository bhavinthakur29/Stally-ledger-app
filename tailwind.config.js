/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDF5',
        parchment: '#F5F0E6',
        ledger: {
          border: '#E8E0D4',
          muted: '#78716C',
          ink: '#1C1917',
        },
      },
    },
  },
  plugins: [],
};
