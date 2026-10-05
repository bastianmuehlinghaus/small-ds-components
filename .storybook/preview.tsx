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
    a11y: { test: "error" },
    // A "Code" tab beside Controls: the JSX of the current story, live.
    docs: { codePanel: true },
  },
};

export default preview;
