import type { APIRoute } from 'astro'
import { generateOgImageForSite } from '@helpers/content/images'

export const GET: APIRoute = async () =>
  new Response(await generateOgImageForSite(), {
    headers: { 'Content-Type': 'image/png' },
  })
