import { defineConfig } from "vite";

import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const postcssConfig = await import('./postcss.config.ts');

  return {
    plugins: [
      react()
    ],
    css: {
      postcss: postcssConfig.default,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});