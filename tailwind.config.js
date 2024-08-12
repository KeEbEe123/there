/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        pixelify: ["Pixelify Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
