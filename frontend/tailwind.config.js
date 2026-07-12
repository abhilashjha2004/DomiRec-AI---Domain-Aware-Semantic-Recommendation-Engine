/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#060a12",
          900: "#0B1220",
          850: "#0e1729",
          800: "#111827",
          700: "#1F2937",
          600: "#374151",
          500: "#4B5563",
          400: "#94A3B8"
        },
        accent: {
          emerald: "#10B981",
          teal: "#14B8A6",
          amber: "#F59E0B",
          primary: "#10B981",
          secondary: "#14B8A6",
          accent: "#F59E0B"
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        "glass-border": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)",
        "neon-green": "0 0 15px rgba(16, 185, 129, 0.25)",
        "neon-teal": "0 0 15px rgba(20, 184, 166, 0.25)",
        "neon-amber": "0 0 15px rgba(245, 158, 11, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "float": "float 8s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        }
      }
    },
  },
  plugins: [],
}
