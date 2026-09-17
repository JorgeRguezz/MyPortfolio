#!/usr/bin/env node
/**
 * Screenshot a URL as a phone would render it.
 *
 *   node scripts/screenshot.mjs <url> <out.png> [--dark] [--viewport] [--width=390] [--height=844] [--scroll=<px>]
 *
 * Defaults: iPhone 14-ish viewport (390×844 @2x), light scheme, FULL PAGE capture.
 * --viewport      capture only the first screen instead of the full page
 * --scroll=<px>   scroll to this Y before capturing (use with --viewport to inspect a section)
 * --dark          emulate prefers-color-scheme: dark
 * --reduced       emulate prefers-reduced-motion: reduce
 *
 * Reveal animations are triggered by scrolling the page to the bottom and back
 * before capture so a full-page shot shows everything, not opacity-0 blocks.
 */
import { chromium } from 'playwright'

const [url, out, ...flags] = process.argv.slice(2)
if (!url || !out) {
  console.error('usage: node scripts/screenshot.mjs <url> <out.png> [--dark] [--viewport] [--width=390] [--height=844] [--scroll=px]')
  process.exit(1)
}
const flag = (name) => flags.includes(`--${name}`)
const opt = (name, dflt) => {
  const f = flags.find((x) => x.startsWith(`--${name}=`))
  return f ? Number(f.split('=')[1]) : dflt
}

const width = opt('width', 390)
const height = opt('height', 844)

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 2,
  isMobile: width < 800,
  hasTouch: width < 800,
  colorScheme: flag('dark') ? 'dark' : 'light',
  reducedMotion: flag('reduced') ? 'reduce' : 'no-preference',
})
const page = await context.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})

await page.goto(url, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)

// Walk the page so every in-view reveal has fired, then return to top.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.6
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 80))
  }
  window.scrollTo(0, document.body.scrollHeight)
  await new Promise((r) => setTimeout(r, 200))
  window.scrollTo(0, 0)
})
await page.waitForTimeout(600)

const scrollY = opt('scroll', 0)
if (scrollY) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY)
  await page.waitForTimeout(700)
}

await page.screenshot({ path: out, fullPage: !flag('viewport') })
const h = await page.evaluate(() => document.body.scrollHeight)
console.log(`saved ${out}  (viewport ${width}×${height}, page height ${h}px, ${flag('dark') ? 'dark' : 'light'})`)
if (errors.length) {
  console.log('console/page errors:')
  for (const e of errors) console.log('  -', e)
}
await browser.close()
