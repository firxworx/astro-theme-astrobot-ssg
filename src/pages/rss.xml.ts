import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'
import { ASTRO_SITE_URL, BLOG_PATHNAME_SEGMENT, SITE } from '@config'
import { getFilteredSortedPosts } from '@helpers/content/posts'

/**
 * Generate RSS feed XML for the blog collection.
 *
 * Assumes that the BLOG_PATHNAME_SEGMENT constant reflects the URL pathname segment of the 'blog' collection.
 * The pathname of an item's `link` value should respect the `trailingSlash` setting in `astro.config.mjs`.
 */
export async function GET({ site }: APIContext): Promise<Response> {
  const posts = getFilteredSortedPosts(await getCollection('blog'))

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: site ?? ASTRO_SITE_URL,
    items: posts.map(({ data, slug }) => ({
      link: `${BLOG_PATHNAME_SEGMENT}/${slug}/`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modifiedAt || data.publishedAt),
    })),
  })
}
