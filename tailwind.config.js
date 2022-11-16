module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      width: {
        "3/2": "150%",
        "2/1": "200%",
        "4/2": "200%",
        double: "200%",
        "5/2": "250%",
      },
      backgroundSize: {
        "half-width": "50% 100%",
        "double-width": "200% 100%",
      },
      backgroundImage: {
        rainbow:
          "linear-gradient(115deg,#4fcf70,#fad648,#a767e5,#12bcfe,#44ce7b)",
        rainbow2:
          "linear-gradient(141.27deg,#ff904e 0%,#ff5982 20%,#ec68f4 40%,#79e2ff 80%)",
        "opaque-radial": "radial-gradient(closest-side,#ffffff20,#00000032)",
      },
      animation: {
        "waving-hand": "waving-hand 2.5s infinite",
        "move-left": "move-left 1.5s linear infinite",
        "language-guide": "language-guide 5s linear alternate infinite",
        "bg-pingpong": "bg-pingpong 5s ease infinite alternate",
      },
      keyframes: {
		"bg-pingpong": {
			to: { "background-position-x": "50%"},
		},
        "waving-hand": {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(20deg)" },
          "20%": { transform: "rotate(-10deg)" },
          "30%": { transform: "rotate(10deg)" },
          "40%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(0.0deg)" },
        },
        "move-left": {
          to: { transform: "translateX(-50%)" },
        },
        "language-guide": {
          "0%": { opacity: "1", content: '"Tap here to change language"' },
          "30%": { opacity: "1", content: '"Tap here to change language"' },
          "50%": { opacity: "0", content: '"Tap here to change language"' },
          "51%": { opacity: "0", content: '"言語変更には、ここにタップ"' },
          "70%": { opacity: "1", content: '"言語変更には、ここにタップ"' },
          "100%": { opacity: "1", content: '"言語変更には、ここにタップ"' },
        },
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
