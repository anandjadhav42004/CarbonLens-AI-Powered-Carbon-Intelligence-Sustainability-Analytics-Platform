/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#274a31",
        "primary-container": "#3e6247",
        "secondary": "#655e4e",
        "surface": "#ffffff",
        "on-surface": "#2C2C2A",
        "outline-variant": "#E7E7E7",
        "outline": "#727971",
        "surface-container-low": "#f4f4ef",
        "surface-container-lowest": "#ffffff",
        "surface-container": "#eeeeea",
        "surface-container-high": "#e8e8e4",
        "surface-bright": "#f9faf5",
        "accent-gold": "#c8a97e",
        "tertiary": "#62353e",
        "tertiary-container": "#7d4c55"
      },
      fontFamily: {
        "literata": ["Literata", "serif"],
        "inter": ["Inter", "sans-serif"],
        "mono": ["Space Mono", "JetBrains Mono", "monospace"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "20px",
        "full": "9999px"
      },
      boxShadow: {
        "soft": "0px 10px 15px -3px rgba(44, 44, 42, 0.05)",
        "luxury": "0 12px 40px -12px rgba(47, 79, 55, 0.08)"
      }
    },
  },
  plugins: [],
}
