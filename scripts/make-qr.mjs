#!/usr/bin/env node
/**
 * Generate the static QR assets for a given URL.
 *
 *   npm run qr                                   → default URL (see lib.mjs)
 *   npm run qr -- https://jorge-ruigomez.vercel.app
 *
 * Produces:
 *   public/qr.svg       QR only, black on transparent, EC level M
 *   public/qr.png       1024×1024, black on white, 4-module quiet zone (print / messages)
 *   public/qr-card.png  1080×1920 lock-screen card (needs `sharp`; skipped if it fails)
 *
 * Also points og:image / twitter:image in index.html at the absolute URL, since
 * most link scrapers (Slack, LinkedIn, iMessage) ignore relative image URLs.
 */
import { readFile, writeFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import QRCode from 'qrcode'
import { person } from '../src/content.ts'
import { PUBLIC, ROOT, palette, fonts, urlFromArgv, hostOf, qrPath, esc, kb } from './lib.mjs'

const explicitUrl = process.argv.slice(2).some((a) => !a.startsWith('-'))
const url = urlFromArgv()
const host = hostOf(url)
console.log(`QR target: ${url}${explicitUrl ? '' : '  (default; pass the real URL after first deploy)'}`)

const produced = []
async function done(path) {
  const { size } = await stat(path)
  produced.push([path.replace(`${ROOT}/`, ''), size])
}

// 1. qr.svg — black on transparent. `#0000` is qrcode's transparent.
{
  const svg = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    color: { dark: '#000000ff', light: '#00000000' },
  })
  const out = resolve(PUBLIC, 'qr.svg')
  await writeFile(out, svg)
  await done(out)
}

// 2. qr.png — 1024², black on white, full 4-module quiet zone for print.
{
  const out = resolve(PUBLIC, 'qr.png')
  await QRCode.toFile(out, url, {
    type: 'png',
    errorCorrectionLevel: 'M',
    width: 1024,
    margin: 4,
    color: { dark: '#000000', light: '#ffffff' },
  })
  await done(out)
}

// 3. qr-card.png — 1080×1920 lock-screen card, composed as SVG → PNG via sharp.
let cardError = null
try {
  const { default: sharp } = await import('sharp')
  const W = 1080
  const H = 1920
  const qr = qrPath(url, { margin: 0 })
  const QR = 620 // rendered QR size in px
  const PAD = 56 // white card padding around the QR
  const CARD = QR + PAD * 2
  const cardX = (W - CARD) / 2
  const cardY = (H - CARD) / 2 + 40 // nudge down so the name sits in the upper third
  const scale = QR / qr.modules

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${palette.bg}"/>
  <!-- name + role -->
  <text x="${W / 2}" y="${cardY - 300}" text-anchor="middle" font-family="${esc(fonts.serif)}" font-size="76" letter-spacing="-1.5" fill="${palette.fg}">${esc(person.shortName)}</text>
  <text x="${W / 2}" y="${cardY - 236}" text-anchor="middle" font-family="${esc(fonts.mono)}" font-size="26" letter-spacing="4" fill="${palette.fgSubtle}">${esc(person.roleLine.toUpperCase())}</text>
  <!-- pipeline line: the site's signature, leading from the name to the QR -->
  <line x1="${W / 2}" y1="${cardY - 190}" x2="${W / 2}" y2="${cardY - 56}" stroke="${palette.line}" stroke-width="2"/>
  <circle cx="${W / 2}" cy="${cardY - 56}" r="7" fill="${palette.accent}"/>
  <!-- QR card -->
  <rect x="${cardX}" y="${cardY}" width="${CARD}" height="${CARD}" rx="48" fill="${palette.bgElevated}" stroke="${palette.line}" stroke-width="2"/>
  <g transform="translate(${cardX + PAD} ${cardY + PAD}) scale(${scale})" fill="#000000" shape-rendering="crispEdges">
    <path d="${qr.d}"/>
  </g>
  <!-- below -->
  <text x="${W / 2}" y="${cardY + CARD + 96}" text-anchor="middle" font-family="${esc(fonts.mono)}" font-size="30" fill="${palette.fgSubtle}">${esc(host)}</text>
  <text x="${W / 2}" y="${cardY + CARD + 150}" text-anchor="middle" font-family="${esc(fonts.sans)}" font-size="30" fill="${palette.fgMuted}">Scan to open my portfolio</text>
</svg>`

  const out = resolve(PUBLIC, 'qr-card.png')
  await sharp(Buffer.from(svg), { density: 72 }).png({ compressionLevel: 9, palette: true }).toFile(out)
  await done(out)
} catch (err) {
  cardError = err
}

// 4. Point the social image at the absolute URL, but only when one was given
//    explicitly: a wrong absolute URL is worse than the relative default.
if (explicitUrl) {
  const indexPath = resolve(ROOT, 'index.html')
  const html = await readFile(indexPath, 'utf8')
  const next = html.replace(
    /(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*(")/g,
    `$1${url}/og.png$2`,
  )
  if (next !== html) {
    await writeFile(indexPath, next)
    console.log(`index.html: og:image / twitter:image → ${url}/og.png`)
  }
}

console.log('')
for (const [file, size] of produced) console.log(`  ${file.padEnd(22)} ${kb(size)}`)
if (cardError) {
  console.log('')
  console.log('qr-card.png was NOT produced (sharp failed):')
  console.log(`  ${cardError.message}`)
  process.exitCode = 2
}
