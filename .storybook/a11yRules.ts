/** The axe rules every story runs with (see the a11y parameter in preview.tsx).
 *  A file of their own because Storybook replaces arrays when it merges
 *  parameters: a story that adds a rule must spread these, or it silently
 *  drops them. */
export const a11yRules = [
  { id: "color-contrast", selector: "*:not([data-disabled], [data-disabled] *)" },
  { id: "target-size", enabled: true },
];
