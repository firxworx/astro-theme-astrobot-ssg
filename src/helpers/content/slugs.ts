const SEPARATOR = '-'
const MULTI_SEPARATOR_REGEX = new RegExp(`${SEPARATOR}+`, 'g')

/**
 * Slugify the given string value(s).
 * Note that Astro will automatically generate slugs for content collections.
 *
 * @see https://gist.github.com/max10rogerio/c67c5d2d7a3ce714c4bc0c114a3ddc6e
 * @see https://gist.github.com/codeguy/6684588
 * @see https://byby.dev/js-slugify-string
 * @see https://github.com/Flet/github-slugger/tree/master library alternative to consider
 */
export const slugify = (...args: string[]): string => {
  const value = args.join(' ')

  return value
    .normalize('NFKD') // split an accented letter in the base letter and the accent (NFD vs NFKD)
    .replace(/[\u0300-\u036f]/g, '') // remove accents split in above step
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all non-letter, non-number, and space characters
    .replace(/_/g, SEPARATOR) // replace underscore with separator
    .replace(/\s+/g, SEPARATOR) // replace whitespace with separator
    .replace(MULTI_SEPARATOR_REGEX, SEPARATOR) // replace multiple dashes with single separator
}
