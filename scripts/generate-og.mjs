import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Resvg } from '@resvg/resvg-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const svg = readFileSync(join(__dirname, 'og-template.svg'), 'utf-8')

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    loadSystemFonts: true,
  },
})

const pngData = resvg.render()
const pngBuffer = pngData.asPng()

const outDir = join(__dirname, '..', 'public')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'og.png'), pngBuffer)

console.log(`✓ Generated og.png (${(pngBuffer.length / 1024).toFixed(1)} KB)`)

