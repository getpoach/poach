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
        // Static fallbacks — runtime theming done via CSS vars in globals.css
        gold:    "#B8935A",
        ink:     "#16151A",
        surface: "#1C1B21",
        card:    "#232229",
        border:  "#2E2C35",
        muted:   "#8A8578",
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
