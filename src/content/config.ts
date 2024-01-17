import { defineCollection } from 'astro:content'
import { zPostMeta } from '@/types/z-content'

/**
 * Astro `src/content/config.ts` is an Astro configuration file for defining content collection schemas.
 *
 * @see https://docs.astro.build/en/guides/content-collections/
 */

/**
 * Collection of blog posts.
 */
const blogCollection = defineCollection({
  type: 'content',
  schema: zPostMeta,
})

/**
 * All collections should be exported under the `collections` object.
 */
export const collections = {
  blog: blogCollection,
}
