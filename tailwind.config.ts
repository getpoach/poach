import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Georgia", "'Times New Roman'", "serif"],
        sans:    ["var(--font-dm-sans)", "sans-serif"],
        serif:   ["Georgia", "'Times New Roman'", "serif"],
      },
      colors: {
        gold:    "var(--gold)",
        ink:     "var(--bg)",
        surface: "var(--bg-secondary)",
        card:    "var(--bg-tertiary)",
        border:  "var(--border)",
        muted:   "var(--text-muted)",
        stone:   "#C9C4B8",
        brass:   "#B8935A",
        marble:  "#16151A",
        ivory:   "#EDE7DA",
      },
    },
  },
  plugins: [],
};

export default config;
