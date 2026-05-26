import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        gold:    "var(--gold)",
        ink:     "var(--bg)",
        surface: "var(--bg-secondary)",
        card:    "var(--bg-tertiary)",
        border:  "var(--border)",
        muted:   "var(--text-muted)",
      },
    },
  },
  plugins: [],
};

export default config;
