import type { Preview, Decorator } from "@storybook/react-vite";
import "@small-ds/tokens/css";
import "@small-ds/tokens/typography.css";
import "./fonts.css";
import "./preview.css";

/**
 * Drives the same `data-theme` attribute a real consumer would set, rather than
 * a Storybook-only mechanism — so what you check here is what ships.
 */
const withTheme: Decorator = (Story, context) => {
  document.documentElement.setAttribute("data-theme", context.globals.theme);
  return Story();
};

const preview: Preview = {
  // A Docs page per component: every story with "Show code", plus a props
  // table generated from the TypeScript types and their comments.
  tags: ["autodocs"],
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Token mode",
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    // Any axe violation fails `npm test`. One narrow exemption: WCAG 1.4.3
    // exempts inactive controls from contrast, and axe already skips text
    // inside natively disabled elements, but not text beside them, such as a
    // disabled Checkbox's label or a disabled TextField's description. Those
    // all sit inside a [data-disabled] element (Radix or TextField sets it),
    // so the contrast rule skips exactly that. Every other rule still runs
    // there.
    a11y: {
      test: "error",
      config: {
        rules: [{ id: "color-contrast", selector: "*:not([data-disabled], [data-disabled] *)" }],
      },
    },
    // A "Code" tab beside Controls: the JSX of the current story, live.
    docs: { codePanel: true },
  },
};

export default preview;
