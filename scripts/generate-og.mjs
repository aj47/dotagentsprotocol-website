import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Resvg } from '@resvg/resvg-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const outDir = join(__dirname, '..', 'public')
mkdirSync(outDir, { recursive: true })

const images = [
  { template: 'og-template.svg', output: 'og.png' },
  { template: 'og-hub-template.svg', output: 'og-hub.png' },
]

for (const image of images) {
  const svg = readFileSync(join(__dirname, image.template), 'utf-8')

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: {
      loadSystemFonts: true,
    },
  })

  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  writeFileSync(join(outDir, image.output), pngBuffer)
  console.log(`✓ Generated ${image.output} (${(pngBuffer.length / 1024).toFixed(1)} KB)`)
}

