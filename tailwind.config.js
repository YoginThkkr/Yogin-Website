/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#FFFFFF",
        card: "#FFFFFF",
        line: "#D4D4D4",
        chrome: {
          start: "#000000",
          end: "#000000",
        },
      },
      fontFamily: {
        sans: ["Kanit", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "Times New Roman", "serif"],
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(90deg, #A855F7 0%, #D946A8 50%, #F97316 100%)",
      },
    },
  },
  plugins: [],
};
