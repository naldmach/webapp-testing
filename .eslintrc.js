module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",

    // General rules
    "no-console": "off", // Allow console.log in tests
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",

    // Code style
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "comma-trailing": "off",

    // Best practices
    eqeqeq: "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",
  },
  overrides: [
    {
      files: ["**/*.spec.ts", "**/*.test.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-console": "off",
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "playwright-report/",
    "test-results/",
    "allure-results/",
    "*.js",
  ],
};
