import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary palette
        navy: {
          DEFAULT: "#1A1F3A",
          light: "#2A3F5F",
          lighter: "#3A4F7F",
          dark: "#0A0F20",
        },
        cyan: {
          DEFAULT: "#00D4FF",
          light: "#4DE8FF",
          dark: "#0090B3",
        },
        purple: {
          DEFAULT: "#7B2CBF",
          light: "#9B5CBF",
          dark: "#5B0C9F",
        },
        // Semantic colors
        success: {
          DEFAULT: "#00E676",
          light: "#69F0AE",
          dark: "#00C853",
        },
        warning: {
          DEFAULT: "#FFA726",
          light: "#FFB74D",
          dark: "#F57C00",
        },
        error: {
          DEFAULT: "#FF5252",
          light: "#EF5350",
          dark: "#C62828",
        },
        info: {
          DEFAULT: "#29B6F6",
          light: "#64B5F6",
          dark: "#1565C0",
        },
        // Surface colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border-color)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.25rem", { lineHeight: "1.5" }],
        "2xl": ["1.5rem", { lineHeight: "1.4" }],
        "3xl": ["1.75rem", { lineHeight: "1.3" }],
        "4xl": ["2rem", { lineHeight: "1.2" }],
        "5xl": ["2.25rem", { lineHeight: "1.2" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in-top": "slide-in-from-top 0.2s ease-out",
        "slide-in-bottom": "slide-in-from-bottom 0.2s ease-out",
        "spin-slow": "spin-slow 1.5s linear infinite",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
