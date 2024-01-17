import type { CollectionEntry } from 'astro:content'

/**
 * Return a copy of the given array of posts with drafts removed and sorted by date.
 * Sorts by most recent `modifiedAt` (if defined) then `publishedAt` date.
 */
export function getFilteredSortedPosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.modifiedAt ?? b.data.publishedAt).getTime() / 1000) -
        Math.floor(new Date(a.data.modifiedAt ?? a.data.publishedAt).getTime() / 1000),
    )
}
