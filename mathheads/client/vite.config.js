import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:5000", // Line 3 - might be missing semicolon or malformed
    },
  },
});
