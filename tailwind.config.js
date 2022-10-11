module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    backgroundColor: (theme) => ({
      ...theme("colors"),
      ["primary-100"]: "#CCE2FF",
      ["primary-300"]: "#66A7FF",
      ["primary-500"]: "#52B5F9",
      ["primary-700"]: "#0057CC",
      ["primary-hover"]: "#1287DE",
      ["primary-900"]: "#004199",
      ["dark-50"]: "#E6E6E6",
      ["dark-100"]: "#666666",
      ["dark-300"]: "#4D4D4D",
      ["dark-500"]: "#0E1E3E",
      ["dark-600"]: "#33333380",
      ["dark-700"]: "#05173A",
      ["dark-900"]: "#000E2B",
      ["dark"]: "rgba(255, 255, 255, 0.08)"
    }),
    textColor: (theme) => ({
      ...theme("colors"),
      ["primary-100"]: "rgba(255, 255, 255, 0.87)",
      ["primary-300"]: "rgba(255, 255, 255, 0.6)",
      ["primary-400"]: "rgb(0, 152, 217, 10%)",
      ["primary-500"]: "#52B5F9",
      ["primary-700"]: "rgba(255, 255, 255, 0.16)",
      ["primary-900"]: "rgba(255, 255, 255, 0.08)",
      ["dark-100"]: "rgba(255, 255, 255, 0.87)",
      ["dark-300"]: "rgba(255, 255, 255, 0.6)",
      ["dark-500"]: "rgba(255, 255, 255, 0.38)",
      ["dark-700"]: "rgba(255, 255, 255, 0.16)",
      ["dark-800"]: "#1A1A1A",
      ["dark-900"]: "rgba(255, 255, 255, 0.08)",
      ["dark"]: "#000E2B",
      ["error-red-100"]: "#FF8086",
      ["error-red-300"]: "#FF464F",
      ["error-red-500"]: "#A1374C",
      ["error-warring-100"]: "#FFC195",
      ["error-warring-300"]: "#FF8A34",
      ["error-warring-500"]: "#B87236",
      ["orange-400"]: "rgb(255, 173, 0)"
    }),
    borderColor: (theme) => ({
      ...theme("colors"),
      primary: "#dfe1e6",
      secondary: "#153993",
      danger: "#e3342f",
      ["dark-100"]: "rgba(255, 255, 255, 0.16)",
      ["dark-300"]: "#4D4D4D",
      ["dark-500"]: "#0E1E3E",
      ["dark-900"]: "rgba(255, 255, 255, 0.08)"
    }),
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      ["2xl"]: "1536px",
      ["3xl"]: "1920px"
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/line-clamp")]
}
