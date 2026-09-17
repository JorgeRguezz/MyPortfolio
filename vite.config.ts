import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

/**
 * The two font files every latin visitor needs above the fold: the display
 * serif (h1) and the body sans. Fontsource splits by unicode-range, so only the
 * `latin` subsets qualify; the italic serif and mono are used further down.
 */
const CRITICAL_FONTS = [/^instrument-serif-latin-400-normal-.*\.woff2$/, /^inter-latin-wght-normal-.*\.woff2$/]

/**
 * Injects `<link rel="preload" as="font">` for CRITICAL_FONTS into every HTML
 * entry, resolving the hashed filenames from the bundle so they never go stale.
 * Without this the browser only discovers fonts after CSS + JS + first React
 * render; with it they download alongside the JS. Measured (Lighthouse mobile,
 * simulated slow 4G): FCP 2.4 s → 2.0 s, LCP 2.4 s → 2.3 s, same total bytes.
 */
function preloadCriticalFonts(): Plugin {
  return {
    name: 'preload-critical-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return [] // dev server: fonts are served unhashed, nothing to preload
        return Object.values(ctx.bundle)
          .filter((a) => a.type === 'asset' && CRITICAL_FONTS.some((re) => re.test(a.fileName.replace(/^assets\//, ''))))
          .map((a) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: true, href: '/' + a.fileName },
            injectTo: 'head-prepend' as const,
          }))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadCriticalFonts()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        qr: resolve(import.meta.dirname, 'qr.html'),
      },
    },
  },
})
