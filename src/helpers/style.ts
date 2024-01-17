import { createTailwindMerge, getDefaultConfig } from 'tailwind-merge'

/**
 * Accepted values for the tailwind style helper functions `clsx()` and `cn()`.
 */
export type ClassValue = ClassValue[] | ClassDictionary | string | number | undefined | null | boolean

/**
 * Record (dictionary) of css class names and the nullish/boolean result of their evaluation.
 */
export interface ClassDictionary {
  [id: string]: boolean | undefined | null
}

/**
 * Project configuration for tailwind-merge.
 * Customize it further and set a prefix if required.
 */
const tailwindMergeConfig = {
  ...getDefaultConfig(),
  prefix: '',
}

/**
 * Project tailwind-merge function.
 */
const twMerge = createTailwindMerge(() => tailwindMergeConfig)

/**
 * TypeScript adaptation of clsx() from the legendary npm package 'clsx' by Luke Edwards.
 * Implemented here for one less dependency.
 *
 * @see https://github.com/lukeed/clsx/blob/master/src/index.js for the original
 */
export function clsx(...args: ClassValue[]): string {
  return args.map(toVal).filter(Boolean).join(' ')
}

/**
 * The mighty `cn()` function that combines `clsx()` and `tailwind-merge` to intelligently
 * merge Tailwind and custom css class names.
 *
 * Enables the creation of components with easy-to-override styles.
 */
export function cn(...args: ClassValue[]): string {
  return twMerge(clsx(args))
}

/**
 * Flatten a `ClassValue` argument as accepted by `clsx()` to a string.
 */
function toVal(mix: ClassValue): string {
  if (typeof mix === 'string' || typeof mix === 'number') {
    return mix.toString()
  }

  if (mix && typeof mix === 'object') {
    if (Array.isArray(mix)) {
      return mix.filter(Boolean).map(toVal).join(' ')
    }

    // loop is admittedly not as performant vs clsx package's `for..in` however impact is negligible for small objects
    return Object.entries(mix).reduce((acc, [key, value]) => {
      if (value) {
        return acc + ' ' + key
      }

      return acc
    }, '')
  }

  return ''
}
