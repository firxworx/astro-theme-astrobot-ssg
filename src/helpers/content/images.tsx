import * as path from 'path'
import * as fs from 'fs'
import satori, { type SatoriOptions } from 'satori'
import { Resvg } from '@resvg/resvg-js'

import { type CollectionEntry } from 'astro:content'
import { PostImageTemplate } from '@components/react/image-templates/PostImageTemplate'
import { SiteImageTemplate } from '@components/react/image-templates/SiteImageTemplate'
import { SITE } from '@config'

/**
 * Fetch fonts from a URL.
 *
 * At this time satori does not support the WOFF2 font format.
 * @see https://github.com/vercel/satori#language-and-typography
 */
export async function fetchFonts(urls: {
  regular: string
  bold: string
}): Promise<{ fontRegular: ArrayBuffer; fontBold: ArrayBuffer }> {
  const fontFileRegular = await fetch(urls.regular)
  const fontRegular: ArrayBuffer = await fontFileRegular.arrayBuffer()

  const fontFileBold = await fetch(urls.bold)
  const fontBold: ArrayBuffer = await fontFileBold.arrayBuffer()

  return { fontRegular, fontBold }
}

/**
 * Read fonts synchronously from the file system.
 *
 * At this time satori does not support the WOFF2 font format.
 * @see https://github.com/vercel/satori#language-and-typography
 */
export function readFontsSync(paths: { regular: string; bold: string }): { fontRegular: Buffer; fontBold: Buffer } {
  const fontRegularPath = paths.regular
  const fontBoldPath = paths.bold

  const fontRegular = fs.readFileSync(fontRegularPath)
  const fontBold = fs.readFileSync(fontBoldPath)

  return { fontRegular, fontBold }
}

// read fonts from local font assets
const { fontRegular, fontBold } = readFontsSync({
  regular: path.resolve(process.cwd(), 'src/assets/fonts/inter-latin-ext-400-normal.woff'),
  bold: path.resolve(process.cwd(), 'src/assets/fonts/inter-latin-ext-700-normal.woff'),
})

// use the following to fetch fonts from a url instead (e.g. fonts.cdnfonts.com, og-playground.vercel.app, etc.):
// const { fontRegular, fontBold } = await fetchFonts(...)

const options: SatoriOptions = {
  width: SITE.ogImageWidthPx,
  height: SITE.ogImageHeightPx,
  embedFont: true,
  fonts: [
    {
      name: 'Inter Latin',
      data: fontRegular,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Inter Latin',
      data: fontBold,
      weight: 600,
      style: 'normal',
    },
  ],
}

export function svgBufferToPngBuffer(svg: string): Buffer {
  const resvg = new Resvg(svg)
  const pngData = resvg.render()

  return pngData.asPng()
}

export async function generateOgImageForPost(post: CollectionEntry<'blog'>): Promise<Buffer> {
  const svg = await satori(PostImageTemplate(post), options)
  return svgBufferToPngBuffer(svg)
}

export async function generateOgImageForSite(): Promise<Buffer> {
  const svg = await satori(SiteImageTemplate(), options)
  return svgBufferToPngBuffer(svg)
}
