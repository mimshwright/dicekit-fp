module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },

  plugins: ["@typescript-eslint", "react", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  overrides: [{ files: ".eslintrc.cjs", parserOptions: { project: null } }],
  rules: {
    "@typescript-eslint/quotes": 0,
    "@typescript-eslint/semi": 0,
    "@typescript-eslint/comma-dangle": 0,
    "@typescript-eslint/no-unused-vars": [
      "error",
      { vars: "all", varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
  },
};
