/**
 * Mechanises rule 2 for the one place stylelint cannot reach: dimensions passed
 * as React props.
 *
 * Radix and Base UI position floating content from numbers handed to JS, before
 * any CSS is laid out, so `sideOffset={4}` is a spacing decision that never
 * appears in a `.css` file. This rejects a literal on those props; the value
 * has to come from `tokenPx()`, which reads it from @small-ds/tokens.
 *
 * Zero is allowed: "no offset" is the absence of a decision, not a value.
 *
 * The parser is Babel rather than typescript-eslint, because typescript-eslint
 * does not yet support the TypeScript major this repo is on.
 */
import babelParser from "@babel/eslint-parser";

// Positioning props that take a dimension. `avoidCollisions` and `sticky` are
// booleans and keywords, not dimensions, so they are not here.
const DIMENSION_PROPS = "sideOffset|alignOffset|collisionPadding|arrowPadding";

const message =
  "A dimension prop must come from a token — use tokenPx(\"sds-…\") from src/tokenPx.ts, not a literal.";

// Attribute (`<X sideOffset={4} />`), object-literal key, and default value
// (`{ sideOffset = 4 }`). The descendant combinator catches nested literals,
// e.g. the sides in `collisionPadding: { top: 8, left: 8 }`.
const restricted = [
  `JSXAttribute[name.name=/^(${DIMENSION_PROPS})$/] Literal[value>0]`,
  `ObjectExpression > Property[key.name=/^(${DIMENSION_PROPS})$/] Literal[value>0]`,
  `AssignmentPattern[left.name=/^(${DIMENSION_PROPS})$/] Literal[value>0]`,
].map((selector) => ({ selector, message }));

export default [
  {
    files: ["src/**/*.{ts,tsx}", "test/eslint/**/*.{ts,tsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [
            ["@babel/preset-react", { runtime: "automatic" }],
            "@babel/preset-typescript",
          ],
        },
      },
    },
    rules: {
      "no-restricted-syntax": ["error", ...restricted],
    },
  },
];
