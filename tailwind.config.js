/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "black_#000000": "#000000",
        "white_#f0f8ff": "#f0f8ff",
      },
      animation: {
        "spin-slow": "spin 10s linear infinite", // animation quay chậm
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
