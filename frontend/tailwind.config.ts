/** @type {import('tailwindcss').Config} */ 
module.exports = { 
  content: [ 
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', 
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', 
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', 
  ], 
  theme: { 
    extend: { 
      fontFamily: { 
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'], 
      }, 
      colors: { 
        brand: { 
          50: '#eef2ff', 
          100: '#e0e7ff', 
          200: '#c7d2fe', 
          300: '#a5b4fc', 
          400: '#818cf8', 
          500: '#6366f1', 
          600: '#4f46e5', 
          700: '#4338ca', 
          800: '#3730a3', 
          900: '#312e81', 
        }, 
      }, 
      boxShadow: { 
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', 
        'card-hover': 
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', 
        modal: 
          '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', 
      }, 
      animation: { 
        'fade-in': 'fadeIn 0.2s ease-in-out', 
        'slide-up': 'slideUp 0.3s ease-out', 
      }, 
      keyframes: { 
        fadeIn: { 
          '0%': { opacity: '0' }, 
          '100%': { opacity: '1' }, 
        }, 
        slideUp: { 
          '0%': { opacity: '0', transform: 'translateY(10px)' }, 
          '100%': { opacity: '1', transform: 'translateY(0)' }, 
        }, 
      }, 
    }, 
  }, 
  plugins: [], 
}; 
