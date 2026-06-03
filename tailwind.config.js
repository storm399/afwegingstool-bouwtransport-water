/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bordeaux: {
          DEFAULT: '#5C1620',
          light: '#7C2E38',
          dark: '#3F0F17',
        },
        vermilion: '#D4321A',
        cream: {
          DEFAULT: '#ECE9E2',
          light: '#F4F0E8',
        },
        ink: '#0A0A0A',
        slate: {
          body: '#393939',
        },
        success: { bg: '#C6E0B4', text: '#375623' },
        warning: { bg: '#FFE699', text: '#806000' },
        danger:  { bg: '#F4B084', text: '#843C0C' },
      },
      fontFamily: {
        head: ['Monument Grotesk', 'system-ui', 'sans-serif'],
        body: ['Neue Haas Grotesk Text Pro', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
