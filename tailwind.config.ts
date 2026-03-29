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
        gold: "#C8A97E",
        ink: "#080808",
        surface: "#111111",
        card: "#141414",
        border: "#1E1E1E",
        muted: "#666666",
      },
    },
  },
  plugins: [],
};

export default config;
