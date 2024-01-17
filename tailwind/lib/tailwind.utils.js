// @ts-check
import { colord } from 'colord'

/**
 * Utilities for working with colors.
 *
 * The colord library (dependency) is useful for manipulating colors and defining project palettes
 * @see https://www.npmjs.com/package/colord
 *
 * When setting colors via css variables take care to specify them correctly to support opacity modifiers
 * @see https://tailwindcss.com/docs/customizing-colors#using-css-variables
 */

/**
 * Round utility borrowed from tailwindcss-typography.
 *
 * @param {number} num
 * @returns {string}
 *
 * @see https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
 */
export const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')

/**
 * rem unit utility borrowed from tailwindcss-typography.
 *
 * @param {number} px
 * @returns {string}
 * @see https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
 */
export const rem = (px) => `${round(px / 16)}rem`

/**
 * em unit utility borrowed from tailwindcss-typography.
 *
 * @param {number} px
 * @param {number} base
 * @returns {string}
 * @see https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
 */
export const em = (px, base) => `${round(px / base)}em`

/**
 * hexToRgb utility borrowed from tailwindcss-typography plugin.
 *
 * @param {string} hex - hex color value
 * @returns {string} - in format `${r} ${g} ${b}`
 * @see https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
 */
export const hexToRgb = (hex) => {
  hex = hex.replace('#', '')
  hex = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `${r} ${g} ${b}`
}

/**
 * Adjust the alpha (transparency) value of a color using the colord library.
 *
 * @param {import('colord').AnyColor | import('colord').Colord} c - initial color accepted in any colord-recognized format
 * @param {number} value - alpha value to set: a number between 0 (transparent) and 1 (opaque).
 * @returns {string} RGB color string with the adjusted alpha value
 */
export const alpha = (c, value) => colord(c).alpha(value).toRgbString()

/**
 * Lighten a color by a specific amount using the colord library.
 *
 * @param {import('colord').AnyColor | import('colord').Colord} c - initial color accepted in any colord-recognized format
 * @param {number} value - amount to lighten the color between 0 (no change) and 1 (completely white)
 * @returns {string} RGB color string with the lightened color
 */
export const lighten = (c, value) => colord(c).lighten(value).toRgbString()

/**
 * Darken a color by a specific amount using the colord library.
 *
 * @param {import('colord').AnyColor | import('colord').Colord} c - initial color accepted in any format recognized by colord
 * @param {number} value - amount to darken the color between 0 (no change) and 1 (black)
 * @returns {string} RGB color string with the darkened color
 */
export const darken = (c, value) => colord(c).darken(value).toRgbString()
