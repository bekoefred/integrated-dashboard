/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "nav-shadow": "0px 4px 15px rgba(0, 0, 0, 0.1)",
        "card-shadow": "0px 2px 10px rgba(0, 0, 0, 0.05)",
        "dropdown-shadow": "0px 4px 7px rgba(0, 0, 0, 0.25)",
      },
      colors: {
        "app-gray-1": "#333",
        "app-gray-2": "#4F4F4F",
        "app-gray-3": "#828282",
        "app-gray-4": "#EAEAEA",
        "app-gray-6": "#F2F2F2",
        "app-blue": "#0052B4",
        "app-blue-2": "#0145e4",
        "app-green-1": "#219653",
        "app-green-2": "#1ABC00",
        "app-red-1": "#CF222E",
        "progress-bar-bg": "#D9D9D9",
      },
      borderColor: {
        "card-border": "1px solid rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
