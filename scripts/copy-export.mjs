import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "out");

if (!existsSync(outDir)) {
  console.error("out/ is missing. Run next build first.");
  process.exit(1);
}

const protectedNames = new Set([
  ".git",
  ".github",
  ".gitignore",
  ".next",
  "README.md",
  "app",
  "components",
  "lib",
  "node_modules",
  "out",
  "package-lock.json",
  "package.json",
  "public",
  "scripts",
  "next-env.d.ts",
  "next.config.ts",
  "tsconfig.json",
  "tsconfig.tsbuildinfo",
]);

for (const name of readdirSync(outDir)) {
  if (protectedNames.has(name)) {
    console.warn(`skipping protected path: ${name}`);
    continue;
  }
  const dest = join(root, name);
  if (existsSync(dest)) {
    rmSync(dest, { recursive: true, force: true });
  }
  cpSync(join(outDir, name), dest, { recursive: true });
  console.log(`copied ${name} -> repository root`);
}
