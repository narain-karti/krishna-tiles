/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F3EEE5',
          light: '#FAF7F2',
          dark: '#E7DFD3',
        },
        porcelain: '#FAF9F6',
        charcoal: {
          DEFAULT: '#29251F',
          soft: '#3D3830',
          muted: '#524B41',
        },
        brass: {
          DEFAULT: '#B89A63',
          light: '#CEB586',
          dark: '#9A7D46',
          muted: 'rgba(184, 154, 99, 0.15)',
        },
        stone: {
          DEFAULT: '#D8D0C3',
          light: '#E6E0D6',
          dark: '#C0B7A7',
        },
        border: {
          DEFAULT: '#E7E0D6',
          dark: '#D5CBBF',
        },
        muted: {
          DEFAULT: '#777168',
          light: '#9E978D',
          dark: '#58534C',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(41, 37, 31, 0.05), 0 1px 4px -1px rgba(41, 37, 31, 0.03)',
        'elevated': '0 10px 30px -5px rgba(41, 37, 31, 0.08), 0 4px 12px -2px rgba(41, 37, 31, 0.04)',
        'modal': '0 25px 50px -12px rgba(41, 37, 31, 0.25)',
        'brass-glow': '0 0 20px -3px rgba(184, 154, 99, 0.35)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
