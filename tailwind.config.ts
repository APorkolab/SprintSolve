import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF6A00', // Brand orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#FFE600', // Brand yellow
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        game: {
          background: '#FFE600',
          border: '#FF0000',
          wall: '#FF4500',
          correct: '#10B981',
          incorrect: '#EF4444',
          neutral: '#6B7280',
          text: '#1F2937',
        },
        dark: {
          900: '#0F1419',
          800: '#1A202C',
          700: '#2D3748',
          600: '#4A5568',
          500: '#718096',
        }
      },
      fontFamily: {
        game: ['"Press Start 2P"', 'monospace'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        'game-xs': ['8px', { lineHeight: '12px' }],
        'game-sm': ['10px', { lineHeight: '14px' }],
        'game-base': ['12px', { lineHeight: '16px' }],
        'game-lg': ['14px', { lineHeight: '18px' }],
        'game-xl': ['16px', { lineHeight: '20px' }],
        'game-2xl': ['20px', { lineHeight: '24px' }],
        'game-3xl': ['24px', { lineHeight: '28px' }],
        'game-4xl': ['32px', { lineHeight: '36px' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FF6A00' },
          '100%': { boxShadow: '0 0 20px #FF6A00, 0 0 30px #FF6A00' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    // Custom plugin for game-specific utilities
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.text-stroke': {
          '-webkit-text-stroke': '1px black',
        },
        '.text-stroke-white': {
          '-webkit-text-stroke': '1px white',
        },
        '.pixelated': {
          'image-rendering': 'pixelated',
          'image-rendering': '-moz-crisp-edges',
          'image-rendering': 'crisp-edges',
        },
        '.game-border': {
          border: '4px solid #FF0000',
          'border-style': 'solid',
        },
        '.game-button': {
          '@apply bg-primary-500 hover:bg-primary-600 active:bg-primary-700': {},
          '@apply text-white font-game text-game-base': {},
          '@apply px-4 py-2 border-2 border-red-600': {},
          '@apply transition-all duration-150': {},
          '@apply hover:scale-105 active:scale-95': {},
        },
        '.glass-effect': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
