import type { Config } from "tailwindcss";

/**
 * Os tokens de cor e fonte vêm das variáveis CSS definidas em
 * src/app/globals.css (fonte única de verdade da identidade visual).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--rgb-primary) / <alpha-value>)",
        "primary-deep": "rgb(var(--rgb-primary-deep) / <alpha-value>)",
        "primary-night": "rgb(var(--rgb-primary-night) / <alpha-value>)",
        accent: "rgb(var(--rgb-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--rgb-accent-soft) / <alpha-value>)",
        "accent-ink": "rgb(var(--rgb-accent-ink) / <alpha-value>)",
        bg: "rgb(var(--rgb-bg) / <alpha-value>)",
        ink: "rgb(var(--rgb-text) / <alpha-value>)",
        white: "rgb(var(--rgb-white) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        "serif-italic": ["var(--font-serif-italic)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "2px",
        md: "4px",
      },
      letterSpacing: {
        label: "0.2em",
        brand: "0.3em",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      maxWidth: {
        site: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
