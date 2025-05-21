import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "module";
import { FlatCompat } from "@eslint/eslintrc";

import parser from "@typescript-eslint/parser";
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });
const project = resolve(__dirname, "tsconfig.json");

export default [
  ...compat.extends("plugin:prettier/recommended"),
  {
    files: ["**/*.ts", "**/*.js"],
    ignores: ["node_modules/**"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", parser: parser, parserOptions: { project } },
    plugins: { prettier: require("eslint-plugin-prettier"), import: require("eslint-plugin-import"), "@typescript-eslint": require("@typescript-eslint/eslint-plugin") },
    settings: { "import/resolver": { node: { extensions: [".js", ".ts"] }, typescript: { alwaysTryTypes: true, project } } },
    rules: {
      "prettier/prettier": ["warn", { bracketSpacing: true, arrowParens: "always", trailingComma: "es5", singleQuote: true, endOfLine: "auto", tabWidth: 2, semi: true }],
      "import/order": [
        "warn",
        {
          groups: ["type", "builtin", "object", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [{ pattern: "~/**", group: "external", position: "after" }],
          "newlines-between": "always",
        },
      ],
      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: ["return", "export"] },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "no-console": "warn",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { args: "after-used", ignoreRestSiblings: false, argsIgnorePattern: "^_.*?$" }],
    },
  },
];
