/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#030712',
          900: '#0F172A',
        },
        accent: {
          cyan: '#06B6D4',
          teal: '#00E5C0',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(6, 182, 212, 0.35)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        pulseRing: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        pulseRing: 'pulseRing 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
