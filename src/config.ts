import { zSiteContent, zSiteConfig } from '@/types/z-config'
import type { SiteContent, SiteConfig } from '@/types/z-config'

/**
 * Astro's `site` url referenced in the config file and used for sitemaps and robots.txt.
 */
export const ASTRO_SITE_URL = import.meta.env.SITE || import.meta.env.ASTRO_CONFIG_SITE_URL

/**
 * URL pathname segment used for blog posts.
 * This value should match where the blog collection is hosted under `src/pages/..` routing.
 */
export const BLOG_PATHNAME_SEGMENT = 'posts'

export const SITE: SiteConfig = zSiteConfig.parse({
  title: import.meta.env.PUBLIC_SITE_TITLE,
  locale: import.meta.env.PUBLIC_LOCALE,
  textDirection: import.meta.env.PUBLIC_TEXT_DIRECTION,
  description: import.meta.env.PUBLIC_META_DESCRIPTION,
  author: import.meta.env.PUBLIC_META_AUTHOR,
  keywords: import.meta.env.PUBLIC_META_KEYWORDS_CSV,
  ogImageHeightPx: import.meta.env.PUBLIC_OG_IMAGE_HEIGHT_PX,
  ogImageWidthPx: import.meta.env.PUBLIC_OG_IMAGE_WIDTH_PX,
})

export const CONTENT: SiteContent = zSiteContent.parse({
  pageSize: import.meta.env.PUBLIC_POSTS_PER_PAGE,
})
