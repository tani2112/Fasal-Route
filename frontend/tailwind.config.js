/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F7F6EE',
          light: '#FCFBF7',
          dark: '#EFECE1',
        },
        forest: {
          DEFAULT: '#0F2B20',
          dark: '#0A1D16',
          light: '#1B4736',
          emerald: '#235D46',
        },
        leaf: {
          DEFAULT: '#2D6A4F',
          light: '#40916C',
          bright: '#52B788',
        },
        amber: {
          DEFAULT: '#F2B134',
          hover: '#E29F20',
          light: '#FEF5E0',
          dark: '#B87B0E',
        },
        soil: {
          DEFAULT: '#141C18',
          muted: '#586960',
          light: '#85968E',
        },
        tomato: {
          DEFAULT: '#E63946',
          light: '#FDECEE',
        },
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #141C18',
        'neo': '3.5px 3.5px 0px #141C18',
        'neo-lg': '6px 6px 0px #141C18',
        'neo-xl': '8px 8px 0px #141C18',
        'neo-amber': '3.5px 3.5px 0px #B87B0E',
        'neo-white': '3px 3px 0px #FFFFFF',
        'neo-inset': 'inset 2px 2px 0px #141C18',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Kannada', 'Noto Sans Tamil', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        kannada: ['Noto Sans Kannada', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
      },
      keyframes: {
        pulseWave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        stampRotate: {
          '0%': { transform: 'scale(2) rotate(-20deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(-8deg)', opacity: '0.9' },
        }
      },
      animation: {
        'wave-1': 'pulseWave 1.2s ease-in-out infinite',
        'wave-2': 'pulseWave 1.2s ease-in-out 0.2s infinite',
        'wave-3': 'pulseWave 1.2s ease-in-out 0.4s infinite',
        'wave-4': 'pulseWave 1.2s ease-in-out 0.6s infinite',
        'wave-5': 'pulseWave 1.2s ease-in-out 0.3s infinite',
        'ripple': 'ripple 1.8s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'stamp': 'stampRotate 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    },
  },
  plugins: [],
}
