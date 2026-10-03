import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lime: {
          DEFAULT: "#00ff87",
          400: "#22c55e",
          500: "#10b981",
          accent: "#00ff87",
          glow: "rgba(0, 255, 135, 0.4)",
        },
        dark: {
          900: "#090d16",
          850: "#0d1322",
          800: "#131b2e",
          700: "#1e2942",
          600: "#2d3b5b",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 255, 135, 0.35)",
        "neon-sm": "0 0 10px rgba(0, 255, 135, 0.25)",
        "neon-lg": "0 0 35px rgba(0, 255, 135, 0.45)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "futuristic-grid":
          "radial-gradient(circle at 50% 20%, rgba(0, 255, 135, 0.08), transparent 60%), linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
