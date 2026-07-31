import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";

const here = path.dirname(fileURLToPath(import.meta.url));
const template = await readFile(path.join(here, "template.html"), "utf8");
const cards = JSON.parse(await readFile(path.join(here, "cards.json"), "utf8"));

const browser = await chromium.launch();

// Normal render
const page1 = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const html1 = template.replaceAll("__VARIANT__", cards[0].variant).replaceAll("__HEADLINE__", cards[0].headline).replaceAll("__SUBLINE__", cards[0].subline);
await page1.setContent(html1, { waitUntil: "networkidle" });
await page1.evaluate(() => document.fonts.ready);
await page1.screenshot({ path: "/tmp/og-home-normal.png" });
console.log("wrote /tmp/og-home-normal.png");

// Font-blocked render
const context2 = await browser.newContext({ offline: true });
const page2 = await context2.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const html2 = template.replaceAll("__VARIANT__", cards[0].variant).replaceAll("__HEADLINE__", cards[0].headline).replaceAll("__SUBLINE__", cards[0].subline);
await page2.setContent(html2, { waitUntil: "networkidle" });
await page2.evaluate(() => document.fonts.ready);
await page2.screenshot({ path: "/tmp/og-home-blocked.png" });
console.log("wrote /tmp/og-home-blocked.png");

await browser.close();

// Compare
const normal = readFileSync("/tmp/og-home-normal.png");
const blocked = readFileSync("/tmp/og-home-blocked.png");
const normalHash = createHash("sha256").update(normal).digest("hex");
const blockedHash = createHash("sha256").update(blocked).digest("hex");
console.log("Normal hash:", normalHash);
console.log("Blocked hash:", blockedHash);
if (normalHash === blockedHash) {
  console.log("FAIL: Files are byte-identical. Montserrat never loaded.");
  process.exit(1);
} else {
  console.log("PASS: Files differ. Montserrat and Source Serif 4 loaded successfully.");
}
