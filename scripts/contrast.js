// Runs Actual CSS's own contrast checker on the brand theme of every remix.
// The theme is the remix's single :root / [data-theme="light"] rule; the rest
// of remix.css is block art direction, which the checker does not read.
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const order = JSON.parse(readFileSync(join(root, "src", "blocks", "order.json"), "utf8"));
const cli = join(root, "node_modules", "actual-css", "src", "cli", "actual-css.js");
const work = mkdtempSync(join(tmpdir(), "actual-blocks-contrast-"));
const failed = [];
let measured = 0;

try {
  for (const id of order) {
    const path = join(root, "src", "blocks", id, "remix.css");
    if (!existsSync(path)) continue;

    const code = readFileSync(path, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    // A remix that keeps the page palette has no theme rule and nothing to measure.
    const theme = /:root\s*,\s*\[data-theme="light"\]\s*\{[^{}]*\}/.exec(code)?.[0];
    if (!theme) continue;

    const file = join(work, `${id}.css`);
    writeFileSync(file, `${theme}\n`);
    const result = spawnSync("bun", ["--bun", cli, "contrast", "--theme", file], { encoding: "utf8", shell: process.platform === "win32" });
    measured += 1;

    if (result.status !== 0) {
      const lines = `${result.stdout}\n${result.stderr}`.split("\n").filter((line) => line.includes("<--") || /error/i.test(line));
      failed.push(`${id}: remix theme misses Actual CSS contrast thresholds\n    ${lines.join("\n    ")}`);
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (failed.length) {
  console.error("\nContrast failed:");
  for (const message of failed) console.error(`- ${message}`);
  process.exit(1);
}

console.log(`\nContrast passed: ${measured} remix theme${measured === 1 ? " meets" : "s meet"} the Actual CSS thresholds in every scheme.`);
