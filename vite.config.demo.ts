import { defineConfig } from "vite";
import pkg from "./package.json";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: `/${pkg.name}/`,
  build: {
    rollupOptions: {
      output: { dir: "demo" },
    },
  },
  plugins: [react()],
});
