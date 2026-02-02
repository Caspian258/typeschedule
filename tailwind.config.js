/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados para cronotipos
        chronotype: {
          lion: '#F59E0B',    // Amarillo/Oro
          bear: '#8B5CF6',    // Púrpura
          wolf: '#3B82F6',    // Azul
          dolphin: '#10B981', // Verde
        },
        // Colores para tipos de eventos
        event: {
          work: '#3B82F6',    // Azul
          study: '#8B5CF6',   // Púrpura
          personal: '#10B981',// Verde
          health: '#EF4444',  // Rojo
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
