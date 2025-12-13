/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(213, 25%, 25%)",
        input: "hsl(213, 25%, 25%)",
        ring: "hsl(200, 23%, 68%)",
        background: "hsl(213, 31%, 12%)",
        foreground: "hsl(210, 29%, 89%)",
        primary: {
          DEFAULT: "hsl(200, 23%, 68%)",
          foreground: "hsl(213, 31%, 12%)",
        },
        secondary: {
          DEFAULT: "hsl(206, 24%, 41%)",
          foreground: "hsl(210, 29%, 89%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 62%, 50%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        muted: {
          DEFAULT: "hsl(213, 31%, 20%)",
          foreground: "hsl(200, 15%, 55%)",
        },
        accent: {
          DEFAULT: "hsl(206, 24%, 35%)",
          foreground: "hsl(210, 29%, 89%)",
        },
        card: {
          DEFAULT: "hsl(213, 31%, 16%)",
          foreground: "hsl(210, 29%, 89%)",
        },
        pulse: {
          dark: "hsl(213, 31%, 23%)",
          medium: "hsl(206, 24%, 41%)",
          light: "hsl(200, 23%, 68%)",
          lightest: "hsl(210, 29%, 89%)",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "calc(1rem - 2px)",
        sm: "calc(1rem - 4px)",
        xl: "calc(1rem + 4px)",
        "2xl": "calc(1rem + 8px)",
        "3xl": "calc(1rem + 16px)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.5)" },
          "50%": { transform: "scaleY(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wave: "wave 1s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

