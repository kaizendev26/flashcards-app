import { resolve } from "path";

export default {
  root: resolve(__dirname, "."),
  build: {
    outDir: "dist",
  },
  server: {
    // port: 8080,
    host: "0.0.0.0",
  },
};
