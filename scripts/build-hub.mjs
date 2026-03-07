// Build script for hub.dotagentsprotocol.com
// Temporarily makes hub.astro the index page, builds, then restores
import { execSync } from 'child_process'
import { renameSync } from 'fs'

const PAGES = 'src/pages'

console.log('🔄 Swapping hub.astro → index.astro for hub build...')
renameSync(`${PAGES}/index.astro`, `${PAGES}/index-protocol.astro`)
renameSync(`${PAGES}/hub.astro`, `${PAGES}/index.astro`)

try {
  console.log('🔨 Building hub...')
  execSync('node scripts/generate-og.mjs && pnpm astro build --outDir dist-hub', { stdio: 'inherit' })
} finally {
  console.log('🔄 Restoring original pages...')
  renameSync(`${PAGES}/index.astro`, `${PAGES}/hub.astro`)
  renameSync(`${PAGES}/index-protocol.astro`, `${PAGES}/index.astro`)
  console.log('✅ Done')
}
