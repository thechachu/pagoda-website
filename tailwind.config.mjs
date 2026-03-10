/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Nunito"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        sky: {
          dawn: '#f4a261',
          day: '#48cae4',
          dusk: '#e76f51',
          night: '#03045e',
        },
        pagoda: {
          50: '#eff9ff',
          100: '#dff2fe',
          200: '#b8e7fd',
          300: '#7ad4fc',
          400: '#35bef8',
          500: '#0ba5e9',
          600: '#0086cc',
          700: '#016aa5',
          800: '#065988',
          900: '#0b4a70',
          950: '#07304a',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'day-gradient': 'linear-gradient(135deg, #48cae4 0%, #0096c7 50%, #023e8a 100%)',
        'night-gradient': 'linear-gradient(135deg, #03045e 0%, #023e8a 50%, #0077b6 100%)',
        'dawn-gradient': 'linear-gradient(135deg, #f4a261 0%, #e76f51 30%, #2a9d8f 100%)',
        'dusk-gradient': 'linear-gradient(135deg, #e76f51 0%, #9b2226 40%, #03045e 100%)',
      },
    },
  },
  plugins: [],
};
