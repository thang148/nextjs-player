module.exports = {
  root: true, // Make sure eslint picks up the config at the root of the directory
  parserOptions: {
    ecmaVersion: 2020, // Use the latest ecmascript standard
    sourceType: "module" // Allows using import/export statements
  },
  settings: {
    react: {
      version: "detect" // Automatically detect the react version
    }
  },
  env: {
    browser: true, // Enables browser globals like window and document
    amd: true, // Enables require() and define() as global variables as per the amd spec.
    node: true // Enables Node.js global variables and Node.js scoping.
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended" // Make this the last element so prettier config overrides other formatting rules
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        endOfLine: "auto",
        printWidth: 120,
        tabWidth: 2,
        trailingComma: "none",
        semi: false,
        parser: "flow"
      }
    ],
    "no-unused-vars": ["warn"],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }]
  }
}
