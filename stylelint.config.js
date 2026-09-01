/**
 * Mechanises the two rules the design system runs on.
 *
 * Without this file, "components only use tokens" is a convention that decays
 * the first time someone is in a hurry. With it, the build fails.
 */

/* Tier 1 primitives, as they appear in CSS.
 *
 * Written to distinguish Tier 1 from the Tier 2 names that shadow them:
 *   --sds-border-width-1   (Tier 1)  vs  --sds-border-width-default (Tier 2)
 *   --sds-size-control-40  (Tier 1)  vs  --sds-size-control-md      (Tier 2)
 *   --sds-border-radius-12 (Tier 1)  vs  --sds-radius-surface       (Tier 2)
 *   --sds-spacing-16       (Tier 1)  vs  --sds-space-inset-lg       (Tier 2)
 * Hence the trailing \d on the numeric families rather than a bare prefix.
 *
 * --sds-motion-* is deliberately absent: it is the one sanctioned exception,
 * because motion has no Tier 2 layer. Durations do not change between modes and
 * the easings are already named by intent, so an alias tier would be 1:1 and
 * carry no meaning. See the tokens package README.
 */
const TIER_1 = String.raw`/--sds-(?:color-(?:neutral|utility|alpha)|typography|layout|opacity|spacing|border-radius)-|--sds-(?:border-width|size-control|size-icon)-\d/`;

/* Bare durations (200ms, .2s) and easing keywords, for the shorthand properties
   that strict-value cannot meaningfully check. */
const TIMING_LITERAL = String.raw`/(^|\s)\.?\d+(\.\d+)?m?s(\s|$|,)/`;
const EASING_LITERAL = String.raw`/(^|\s)(ease|linear|ease-in|ease-out|ease-in-out|step-start|step-end)(\s|$|,)|cubic-bezier\(/`;

/* A raw colour or dimension as the whole value of a local custom property.
   strict-value does not inspect custom properties, so without this a component
   could launder a hardcoded value through one: `--overlay-hover: #00000014`. */
const LITERAL_COLOR = String.raw`/^#[0-9a-fA-F]{3,8}$|^rgba?\(|^hsla?\(|^oklch\(/`;
const LITERAL_DIMENSION = String.raw`/^-?\d*\.?\d+(px|rem|em|%|vh|vw)$/`;

/* Properties that encode a visual decision, and so must come from a token. */
const TOKENISED_PROPERTIES = [
  "/color$/",
  "/^background/",
  "/^border/",
  "/^padding/",
  "/^margin/",
  "/gap$/",
  "/^font/",
  "line-height",
  "letter-spacing",
  "box-shadow",
  "transition-duration",
  "transition-timing-function",
  "/^outline/",
  "fill",
  "stroke",
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
];

/* Values that are structural rather than design decisions, so need no token. */
const STRUCTURAL_VALUES = [
  "inherit", "currentColor", "transparent", "none", "0", "auto", "initial",
  "unset", "revert", "normal", "solid", "dashed", "100%", "fit-content",
  "max-content", "min-content", "1", "1px", "center", "cover", "contain",
];

export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    /* 1. No hardcoded values. Every visual decision resolves to a token. */
    "scale-unlimited/declaration-strict-value": [
      TOKENISED_PROPERTIES,
      { ignoreValues: STRUCTURAL_VALUES, disableFix: true },
    ],

    /* 2. No component reaches past the semantic layer.
       The `transition` entry closes the shorthand loophole: strict-value cannot
       check `transition` (the property name inside it is legitimately not a
       variable), so any bare duration or easing literal is banned outright. */
    "declaration-property-value-disallowed-list": [
      {
        "/.*/": [TIER_1],
        transition: [TIMING_LITERAL, EASING_LITERAL],
        animation: [TIMING_LITERAL, EASING_LITERAL],
        "/^--/": [LITERAL_COLOR, LITERAL_DIMENSION],
      },
      {
        message:
          "Tier 1 primitive. Components must consume Tier 2 semantic or Tier 3 " +
          "component tokens — reaching past the semantic layer re-hardcodes the " +
          "value under a different name and opts out of theming. " +
          "(--sds-motion-* is the one exception.)",
      },
    ],

    /* CSS Modules syntax that stylelint-config-standard does not know about. */
    "property-no-unknown": [true, { ignoreProperties: ["composes"] }],
    "selector-class-pattern": null,
    // A blank line after `composes` separates inherited type from local rules.
    "declaration-empty-line-before": null,
    "custom-property-pattern": null,
    "value-keyword-case": null,
  },
};
