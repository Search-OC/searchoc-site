import { chromium } from "playwright"
import { readFile, mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const here = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(here, "..", "public", "og")
const template = await readFile(path.join(here, "template.html"), "utf8")
const cards = JSON.parse(await readFile(path.join(here, "cards.json"), "utf8"))

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
})

for (const card of cards) {
  const html = template
    .replaceAll("__VARIANT__", card.variant)
    .replaceAll("__HEADLINE__", card.headline)
    .replaceAll("__SUBLINE__", card.subline)

  await page.setContent(html, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)

  const file = path.join(outDir, card.slug + ".png")
  await page.screenshot({ path: file })
  console.log("wrote", file)
}

await browser.close()
