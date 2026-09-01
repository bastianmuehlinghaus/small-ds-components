import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  // Serves .storybook/public at the web root, so /fonts/*.woff2 resolves.
  staticDirs: ["./public"],
};

export default config;
