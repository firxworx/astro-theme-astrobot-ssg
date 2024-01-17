import { z } from 'astro/zod'
import { SITE } from '@config'

export interface PostMeta extends z.infer<typeof zPostMeta> {}
export interface PageLayoutMeta extends z.infer<typeof zPageLayoutMeta> {}
export interface ContentDateMeta extends z.infer<typeof zContentDateMeta> {}

/**
 * Meta object schema for published and modified dates relevant to time-based content.
 */
export const zContentDateMeta = z.object({
  publishedAt: z.coerce.date(),
  modifiedAt: z.coerce
    .date()
    .nullish()
    .transform((x) => x ?? undefined), // .optional()
})

/**
 * Meta for each page to construct document title and meta tags.
 */
export const zPageLayoutMeta = z
  .object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    keywords: z.string(),
    canonicalUrl: z.string().url(),
    image: z.string().optional(),
  })
  .merge(zContentDateMeta.partial())

/**
 * Meta for blog posts of the blog content collection.
 * Note `slug` is not present because it is reserved by Astro and managed/generated if not provided.
 */
export const zPostMeta = z
  .object({
    title: z.string(),
    description: z.string(),
    author: z.string().default(SITE.author || ''),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    canonicalURL: z.string().optional(),
    image: z
      .string()
      .or(
        // based on ImageFunction generated from astro:content but not exported
        z
          .object({
            src: z.string(),
            width: z.number(),
            height: z.number(),
            format: z.string().regex(/^(png|jpg|jpeg|tiff|webp|gif|svg|avif)$/),
          })
          .refine((img) => img.width >= SITE.ogImageWidthPx && img.height >= SITE.ogImageHeightPx, {
            message: `OpenGraph image requires at least ${SITE.ogImageWidthPx}px width and ${SITE.ogImageHeightPx}px height`,
          }),
      )
      .optional(),
  })
  .merge(zContentDateMeta)
