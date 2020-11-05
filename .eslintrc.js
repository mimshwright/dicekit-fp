module.exports = {
  extends: [
    "airbnb",
    "eslint:recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "plugin:ramda/recommended",
  ],
  plugins: ["@typescript-eslint", "prettier", "jsx-a11y", "import", "ramda"],
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      // use <root>/tsconfig.json
      ts: {
        alwaysTryTypes: true, // always try to resolve types under `<root/>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
  },
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["**/*.js"],
      rules: {
        "global-require": "off",
      },
    },
  ],

  rules: {
    "no-unused-vars": "off",
    "no-param-reassign": "off",
    "no-underscore-dangle": "off",
    "import/extensions": "off",
    "import/prefer-default-export": "off",
    "prettier/prettier": ["error", { trailingComma: "all" }],
    "jsx-a11y/label-has-associated-control": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": [
      "error",
      {
        allowedNames: ["_"],
      },
    ],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};
