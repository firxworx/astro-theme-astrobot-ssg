import type { APIRoute } from 'astro'
import { ASTRO_SITE_URL } from '@config'

const robots = `
User-agent: Googlebot
Disallow: /nogooglebot/

User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', ASTRO_SITE_URL).href}
`.trim()

export const GET: APIRoute = () =>
  new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  })
