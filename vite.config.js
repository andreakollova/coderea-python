import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";

export default defineConfig({
  base: "./",
  build: {
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...Object.fromEntries(
          glob
            .sync("icons/*.svg")
            .map((file) => [file.slice(0, -4), resolve(__dirname, file)])
        ),
      },
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            // Remove hash from filename
            return `assets/icons/${assetInfo.name}`;
          }
          return `assets/[name][extname]`;
        },
      },
    },
  },
});
