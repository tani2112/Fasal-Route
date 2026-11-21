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
          DEFAULT: '#F8FAF8',
          light: '#FFFFFF',
          dark: '#F0F4F1',
        },
        primary: {
          DEFAULT: '#16A34A',
          hover: '#15803D',
          light: '#DCFCE7',
          dark: '#166534',
        },
        forest: {
          DEFAULT: '#0F2B20',
          dark: '#0A1D16',
          light: '#1B4736',
          muted: '#4B6358',
        },
        amber: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FEF3C7',
          dark: '#B45309',
        },
        tomato: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        soil: {
          DEFAULT: '#141C18',
          muted: '#4B6358',
          light: '#85968E',
        },
      },
      boxShadow: {
        'agro-sm': '0 2px 8px rgba(15, 43, 32, 0.04)',
        'agro': '0 8px 24px -4px rgba(15, 43, 32, 0.08)',
        'agro-lg': '0 16px 40px -8px rgba(15, 43, 32, 0.12)',
        'agro-hover': '0 12px 28px -4px rgba(22, 163, 74, 0.15)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Kannada', 'Noto Sans Tamil', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        kannada: ['Noto Sans Kannada', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'sans-serif'],
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
      },
      animation: {
        'wave-1': 'pulseWave 1.2s ease-in-out infinite',
        'wave-2': 'pulseWave 1.2s ease-in-out 0.2s infinite',
        'wave-3': 'pulseWave 1.2s ease-in-out 0.4s infinite',
        'ripple': 'ripple 1.8s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      }
    },
  },
  plugins: [],
}
