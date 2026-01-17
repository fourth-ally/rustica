import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: [
        // Allow serving files from the workspace root when installing rustica via file:..
        resolve(__dirname, "..", ".."),
      ],
    },
  },
  build: {
    target: "esnext",
  },
});
