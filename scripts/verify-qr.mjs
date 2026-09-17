#!/usr/bin/env node
/**
 * Prove the QR assets round-trip: decode the PNGs with jsQR and compare with
 * the URL they were generated for.
 *
 *   npm run verify:qr                              → decode public/qr.png + qr-card.png
 *   npm run verify:qr -- https://the-final-url     → same, against that URL
 *   npm run verify:qr -- --page http://localhost:5187/qr.html
 *       → additionally screenshots the live /qr page in light AND dark mode
 *         (Playwright) and checks the code decodes to that page's origin.
 *
 * Exit code 1 on any mismatch.
 */
import { resolve } from 'node:path'
import sharp from 'sharp'
import jsQR from 'jsqr'
import { PUBLIC, urlFromArgv } from './lib.mjs'

const argv = process.argv.slice(2)
const pageIdx = argv.indexOf('--page')
const pageUrl = pageIdx >= 0 ? argv[pageIdx + 1] : null
const staticArgs = argv.filter((a, i) => i !== pageIdx && i !== pageIdx + 1)
const expected = urlFromArgv(staticArgs)

let failures = 0

async function decodeBuffer(input, label, want) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const result = jsQR(new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), info.width, info.height)
  const got = result?.data ?? null
  const ok = got !== null && got.replace(/\/$/, '') === want.replace(/\/$/, '')
  if (!ok) failures++
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${label.padEnd(34)} ${info.width}×${info.height}  → ${got ?? '(no QR found)'}`)
}

for (const file of ['qr.png', 'qr-card.png']) {
  const path = resolve(PUBLIC, file)
  try {
    await decodeBuffer(path, `public/${file}`, expected)
  } catch (err) {
    failures++
    console.log(`FAIL public/${file}: ${err.message}`)
  }
}

if (pageUrl) {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch()
  try {
    for (const colorScheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme })
      const page = await ctx.newPage()
      await page.goto(pageUrl, { waitUntil: 'networkidle' })
      await page.waitForSelector('svg[role="img"]')
      const origin = await page.evaluate(() => window.location.origin)
      const shot = await page.screenshot({ fullPage: false })
      await decodeBuffer(shot, `/qr page (${colorScheme})`, origin)
      await ctx.close()
    }
  } finally {
    await browser.close()
  }
}

if (failures) {
  console.log(`\n${failures} check(s) failed`)
  process.exit(1)
}
console.log('\nAll QR codes decode to the expected URL.')
