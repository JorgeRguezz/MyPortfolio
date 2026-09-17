/**
 * Shared helpers for the asset scripts. Node ≥ 22.6 (type stripping) so we can
 * import `src/content.ts` directly and never duplicate a fact.
 */
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import QRCode from 'qrcode'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const PUBLIC = resolve(ROOT, 'public')

export const DEFAULT_URL = 'https://jorge-ruigomez.vercel.app'

/** Palette mirrors src/index.css (light theme). Rasters cannot read CSS vars. */
export const palette = {
  bg: '#FAFAF7',
  bgElevated: '#FFFFFF',
  fg: '#141414',
  fgMuted: '#5B5B57',
  fgSubtle: '#8A8A84',
  line: '#E6E4DD',
  accent: '#0F766E',
}

/** System fonts only: no font deps for rasters. Georgia matches favicon.svg. */
export const fonts = {
  serif: "Georgia, 'Times New Roman', serif",
  mono: "Menlo, 'SF Mono', 'DejaVu Sans Mono', monospace",
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
}

/** First CLI argument that looks like a URL, else the default. Trailing slash stripped. */
export function urlFromArgv(argv = process.argv.slice(2)) {
  const raw = argv.find((a) => !a.startsWith('-')) ?? DEFAULT_URL
  let url
  try {
    url = new URL(raw.includes('://') ? raw : `https://${raw}`)
  } catch {
    throw new Error(`Not a valid URL: ${raw}`)
  }
  return url.origin
}

export function hostOf(url) {
  return new URL(url).host
}

/**
 * QR modules → a single SVG path string in module units (1 unit = 1 module),
 * offset by `margin` modules. Same approach as qrcode's own SVG renderer.
 */
export function qrPath(text, { errorCorrectionLevel = 'M', margin = 1 } = {}) {
  const qr = QRCode.create(text, { errorCorrectionLevel })
  const { size, data } = qr.modules
  let d = ''
  for (let r = 0; r < size; r++) {
    let run = 0
    for (let c = 0; c <= size; c++) {
      const dark = c < size && data[r * size + c] !== 0
      if (dark) {
        run++
        continue
      }
      if (run > 0) {
        d += `M${c - run + margin} ${r + margin}h${run}v1h-${run}z`
        run = 0
      }
    }
  }
  return { d, modules: size, viewBox: size + margin * 2, version: qr.version }
}

/** Escape text for inclusion in SVG. */
export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}
