/**
 * Returns the input string normalized to have exactly one leading slash.
 */
export function leadingSlash(input: string): string {
  return `/${input.replace(/^\/+/g, '')}`
}

/**
 * Remove all leading slashes from the input string if present.
 */
export function stripLeadingSlashes(input: string): string {
  return input.replace(/^\/+/, '')
}

/**
 * Returns the input string normalized to have exactly one trailing slash.
 */
export function trailingSlash(input: string): string {
  return `${input.replace(/\/+$/g, '')}/`
}

/**
 * Remove all trailing slashes from the input string if present.
 */
export function stripTrailingSlashes(input: string): string {
  return input.replace(/\/+$/, '')
}

/**
 * Returns the input string normalized to have exactly one leading and exactly one trailing slash.
 */
export function ensureSlashes(input: string): string {
  return `/${input.replace(/(^\/+|\/+$)/g, '')}/`
}
