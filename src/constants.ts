import type { NavLink } from './types/site.types'

/**
 * Navigation links that are imported by Astro layouts.
 * All `href` values must respect the `trailingSlash` setting in the Astro config file.
 */
export const LAYOUT_NAV_LINKS: NavLink[] = [
  { href: '/posts/', text: 'Blog' },
  { href: '/react/', text: 'React' },
  { href: '/mdx/', text: 'MDX' },
  { href: '/about/', text: 'About' },
]
