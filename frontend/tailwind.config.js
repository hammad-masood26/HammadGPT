/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // enables dark mode support if you need it
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // your blue accent
        background: "#ffffff",
        text: "#111827",
        graylight: "#f3f4f6",
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // optional but helps with nice form styling
  ],
};
