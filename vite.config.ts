import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@engine": path.resolve(__dirname, "./src/engine"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@ui": path.resolve(__dirname, "./src/ui"),
      "@storage": path.resolve(__dirname, "./src/storage"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    headers: {
      "Cache-Control": "no-store",
    },
  },
  build: {
    target: "ES2020",
    sourcemap: true,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "zustand"],
          geometry: [
            "src/core/geometry",
            "src/core/spatial",
            "src/core/math",
          ],
        },
      },
    },
  },
});
