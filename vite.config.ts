import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
      // Consumers bring their own React and Radix; bundling them would risk
      // two copies of React and break Radix's context-based composition.
      external: [/^react/, /^react-dom/, /^@radix-ui\//],
    },
    cssCodeSplit: false,
  },
});
