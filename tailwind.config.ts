import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        card: "#F7F7F8",
        border: "#E6E6E8",
        accent: "#111111",
        glow: "rgba(0,0,0,0.25)"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0,0,0,0.08)",
        glow: "0 6px 30px rgba(0,0,0,0.15)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
