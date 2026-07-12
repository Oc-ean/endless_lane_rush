/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        asphalt: {
          DEFAULT: '#14151A',
          light: '#1E2028',
          lighter: '#2A2D38'
        },
        speed: {
          yellow: '#F4C430',
          red: '#E63946',
          green: '#2D6A4F',
          grass: '#276749'
        },
        chalk: '#F1FAEE'
      },
      fontFamily: {
        display: ['"Rajdhani"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      backgroundImage: {
        'speed-lines':
          'repeating-linear-gradient(115deg, rgba(244,196,48,0.06) 0px, rgba(244,196,48,0.06) 2px, transparent 2px, transparent 40px)'
      },
      keyframes: {
        'stripe-scroll': {
          '0%': { backgroundPositionY: '0px' },
          '100%': { backgroundPositionY: '400px' }
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        'flash': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 }
        }
      },
      animation: {
        'stripe-scroll': 'stripe-scroll 0.6s linear infinite',
        'float-y': 'float-y 3s ease-in-out infinite',
        'flash': 'flash 1.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
