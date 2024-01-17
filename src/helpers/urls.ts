import { ASTRO_SITE_URL } from '@config'
import { trailingSlash } from '@helpers/slashes'

/**
 * Normalize a URL or pathname to a URL object.
 * The Astro site URL is prepended if a a pathname is provided.
 */
export function normalizeUrl(urlOrPath: string): URL {
  if (!urlOrPath.startsWith('http') && !urlOrPath.startsWith('//')) {
    urlOrPath = `${ASTRO_SITE_URL}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`
  }

  return new URL(urlOrPath, new URL(ASTRO_SITE_URL).origin)
}

/**
 * Return `true` if the given `pathname` matches the `href` or a subpage of it, otherwise `false`.
 */
export function isCurrentPageOrAncestor(pathname: string, href: string | undefined | null): boolean {
  // nullish values are accepted as a convenience for callers e.g. `link.getAttribute('href')` could return null
  if (!href) {
    return false
  }

  // URL objects are not guaranteed to have pathnames with a trailing slash so normalize them
  const path = trailingSlash(normalizeUrl(pathname).pathname)
  const link = trailingSlash(normalizeUrl(href).pathname)

  // check if the pathname is the same as the href or a subpage of it
  return path === link || path.startsWith(link)
}

/**
 * Get the segment of a pathname at the given 0-based index.
 * For example `getPathSegment('/foo/bar', 0)` returns 'foo'.
 */
export function getPathSegment(pathname: string, segmentIndex: number): string | undefined {
  return pathname.split('/').filter(Boolean)[segmentIndex]
}
