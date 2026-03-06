import type { APIRoute } from 'astro'

import { sampleBundles } from '../../data/sample-bundles'

export const prerender = true

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(sampleBundles, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}