/// <reference types="vitest/config" />
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
      cssFileName: "styles",
    },
    rollupOptions: {
      // Consumers bring their own React, Radix and Base UI; bundling them would
      // risk two copies of React and break their context-based composition.
      external: [/^react/, /^react-dom/, /^@radix-ui\//, /^@base-ui\//],
    },
    cssCodeSplit: false,
  },
  // Every story is a test: it must render, its play function (if any) must
  // pass, and axe must find no violations (a11y.test is "error" in
  // preview.tsx). They run in real Chromium, because the components are mostly
  // CSS and only a browser computes it. `npm test` runs them.
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: fileURLToPath(new URL(".storybook", import.meta.url)) })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
