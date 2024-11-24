/** @type {import('tailwindcss').Config} */
export default {
  // content: ["./**/*.{html,js}"],
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        default: "rgb(115 115 115)", //"#d1d1d1",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
