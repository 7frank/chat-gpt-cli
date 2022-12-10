const { build } = require("estrella");

build({
  // minify: true,
  format: "esm",
  target: "esnext",
  platform: "node",
  banner: {
    js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
  },
  entry: "src/index.ts",
  tslint: false,
  bundle: true,
  //external: ["fs", "os", "path"],
  // pass any options to esbuild here...
});
