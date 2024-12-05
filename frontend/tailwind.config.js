/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern:
        /(bg|text|hover:bg|hover:text)-(red|blue|green|yellow|purple|pink|indigo|orange)-(100|200|300|400|500|600|700|800|900)/,
      variants: ["dark"], // Include dark mode if needed
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Google Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
