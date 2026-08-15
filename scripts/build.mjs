import { cp, mkdir, rm } from "node:fs/promises";

await import("./generate-seo-pages.mjs");
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("src/site.html", "dist/index.html");
await cp("public", "dist", { recursive: true });
console.log("Prime Polo production build created in dist/");
