/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: '#CCFF00',
          light: '#D8FF33',
          dark: '#B0DB00',
          muted: 'rgba(204, 255, 0, 0.15)',
        },
        carbon: {
          DEFAULT: '#0A0A0A',
          surface: '#121212',
          card: '#181818',
          border: '#262626',
          muted: '#2E2E2E',
        },
        // Preserve ivory/stone/brass tokens for material swatches
        ivory: {
          DEFAULT: '#F3EEE5',
          light: '#FAF7F2',
          dark: '#E7DFD3',
        },
        brass: {
          DEFAULT: '#B89A63',
          light: '#CEB586',
          dark: '#9A7D46',
        },
        stone: {
          DEFAULT: '#D8D0C3',
          light: '#E6E0D6',
          dark: '#C0B7A7',
        },
        border: {
          DEFAULT: '#E5E5E8',
          dark: '#262626',
        },
        muted: {
          DEFAULT: '#71717A',
          light: '#A1A1AA',
          dark: '#3F3F46',
        }
      },
      fontFamily: {
        display: ['Syne', 'Plus Jakarta Sans', 'sans-serif'],
        stencil: ['"Bebas Neue"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(10, 10, 10, 0.05), 0 1px 4px -1px rgba(10, 10, 10, 0.03)',
        'elevated': '0 20px 40px -15px rgba(10, 10, 10, 0.15)',
        'neon-glow': '0 0 25px -4px rgba(204, 255, 0, 0.5)',
        'modal': '0 25px 60px -12px rgba(10, 10, 10, 0.4)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
