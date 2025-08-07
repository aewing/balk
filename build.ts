import { build } from "bun";

console.log("Building balk...");

await build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "esm",
  target: "node",
  naming: "[name].mjs",
  minify: false,
  external: ["bun"],
});

await build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "cjs",
  target: "node",
  naming: "[name].cjs",
  minify: false,
  external: ["bun"],
});

await Bun.$`bun x tsc --declaration --emitDeclarationOnly --outDir dist --skipLibCheck src/index.ts`;

console.log("Build complete!");