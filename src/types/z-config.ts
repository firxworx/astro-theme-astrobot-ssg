import { z } from 'astro/zod'

export interface SiteConfig extends z.infer<typeof zSiteConfig> {}
export interface SiteContent extends z.infer<typeof zSiteContent> {}

/**
 * The `locale` string must be BCP-47 format e.g. `en-US`.
 *
 * Although not enforced recommended maximum lengths are:
 * - `title` <= 60 (at least for the most important part to display on a results page)
 * - `description` <= 155
 * - `keywords` < 10 comma separated keywords
 */
export const zSiteConfig = z.object({
  title: z.string().default('Astrobot'),
  locale: z.string().default('en'),
  textDirection: z.enum(['ltr', 'rtl']).default('ltr'),
  description: z.string().default(''),
  author: z.string().default(''),
  keywords: z.string().default(''),
  image: z.string().optional(), // url?
  ogImageHeightPx: z.coerce.number().default(630),
  ogImageWidthPx: z.coerce.number().default(1200),
})

export const zSiteContent = z.object({
  pageSize: z.coerce.number().default(10),
})
