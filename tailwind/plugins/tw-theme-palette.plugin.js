import plugin from 'tailwindcss/plugin'

/**
 * @typedef {Object} RGBValues
 * @property {'rgb'} type
 * @property {{r: string, g: string, b: string, a?: string}} values
 */

/**
 * @typedef {Object} HSLValues
 * @property {'hsl'} type
 * @property {{h: string, s: string, l: string, a?: string}} values
 */

/**
 * @typedef {Object} TransparentValue
 * @property {'transparent'} type
 * @property {undefined} values
 */

/**
 * CSS variable prefix to namespace the palette css variables managed by this plugin.
 */
const PALETTE_CSS_VARIABLE_PREFIX = 'P' // e.g. --P-primary

/**
 * Tolerant RGB capture regex that matches a string with rgb color channels both with and without alpha that's
 * optionally wrapped in a rgb() or rgba() color space function. Supports old and new css syntax.
 *
 * There are either 3 or 4 capture groups depending on whether the alpha value is specified.
 * e.g. matches strings `0 0 0`, `0 255 255`, `rgb(0 0 0 / 0.5)`, `rgba(0, 0, 0, 0.5)`
 *
 * - alpha value can be a decimal or percent value and if a percent this symbol is included in the capture group
 */
const RGB_CHANNEL_VALUES_REGEX =
  /^(?:rgba?\()?(\d+\.?\d*)[\s,]*(\d+\.?\d*)[\s,]*(\d+\.?\d*)(?:[\s,]*(?:\/|,)[\s,]*(\d*\.?\d+%?))?(?:\))?;?$/

/**
 * Tolerant HSL capture regex that matches a string with HSL color channels both with and without alpha that's
 * optionally wrapped in a hsl() or hsla() color space function. Supports old and new css syntax.
 *
 * There are either 3 or 4 capture groups depending on whether the alpha value is specified.
 * e.g. matches strings `hsl(50 80% 40%)`, `0.3turn 60% 45% / .7`
 *
 * - H value can include `deg` or `turn` units and these are included in the capture group
 * - S and L values must be percent values and this symbol is included in the capture group
 * - alpha value can be a decimal or percent value and if a percent this symbol is included in the capture group
 */
const HSL_CHANNEL_VALUES_REGEX =
  /^(?:hsla?\()?(\d*\.?\d+(?:deg|turn)?|\d+\.?\d*%)\s*[\s,]+(\d+\.?\d*%)\s*[\s,]+(\d+\.?\d*%)(?:\s*[\s,]*(?:\/|,)\s*(\d*\.?\d+%?))?\s*(?:\))?;?$/

/**
 * An opinionated TailwindCSS plugin for managing a project's theme palette.
 *
 * When provided a project theme palette definition, this plugin will generate CSS variables for the color values
 * as well as tailwind color classes to reference them.
 *
 * This plugin supports light and dark mode (when tailwind is configured to support via '.dark' class),
 * opacity modifiers, and the `@tailwindcss/typography` plugin.
 *
 * The plugin will add css variables for the `@tailwindcss/typography` plugin and map values to the project's
 * theme palette definition so it is applied to `.prose` blocks by default (including 'inverse' for dark mode).
 *
 * The project palette is added to `theme.extend.colors` under the 'P' key.
 *
 * The 'P' convention represents the project's theme palette, e.g. 'text-P-primary' and is both easy to search for
 * and unlikely to conflict with other tailwind classes, custom colors, or plugins.
 *
 * Theme palette definitions:
 *
 * - values can be provided in [light, dark] tuple array format or a string if the value is the same for both modes
 * - can be nested to any depth just like `theme.colors` and `theme.extend.colors` with similar support for `DEFAULT`
 * - arbitrary keys are supported and are converted to css variables with the `--P-` prefix that can be referenced
 *   in project code
 *
 * Supported color value formats:
 *
 * - string of rgb() or hsl() color space channel values e.g. `0 0 0` or `0 0% 0%`
 * - rgb or hsl color space function with or without alpha e.g. `rgb(0 0 0 / 0.5)` or `hsl(0 0% 0% / 0.5)`
 * - a hex string e.g. `#ff00ff` (this supports referencing colors from tailwindcss/colors or a theme() function)
 * - a reference to a css variable e.g. `var(--my-custom-color)` @todo QA on this
 * - the string 'transparent' is supported as a special case
 *
 * When providing an array tuple of light and dark values both values must be the same supported color value format.
 *
 * This plugin requires the following:
 * - tailwind config to use dark mode as a class (`.dark`) on the body element
 *
 * Note that color previews are not available in VSCode IntelliSense because the css variable references both
 * light and dark values.
 *
 * @see https://tailwindcss.com/docs/plugins#extending-the-configuration
 *
 * @future improve support for 'transparent' (and add 'current'?) special cases
 * @future additional color space support (e.g. oklab, oklch, lab, lch, hwb, etc.)
 * @future add tests covering plugin functionality
 */
const themePalettePlugin = plugin.withOptions(
  function (options = { palette: {} }) {
    return function ({ addBase }) {
      const { palette } = options

      addBase({
        ':root': Object.assign(
          {},
          getPaletteCssVariables('light', palette),
          getTailwindTypographyPaletteCssVariables(),
        ),
        '.dark': getPaletteCssVariables('dark', palette),

        // tip: you _could_ optionally extend this plugin and add further css styles right here...
        // however it is more maintainable to centralize all project-specific styling the preset file.
      })
    }
  },
  function (options = { palette: {}, typography: { applyAlpha: true } }) {
    const { palette, typography: typographyOptions } = options

    return {
      theme: {
        extend: {
          colors: {
            P: getTailwindConfigColorsObject(palette),
          },
          typography: {
            DEFAULT: {
              css: {
                // add css variables referenced by tailwind `prose` (`@tailwindcss/typography` plugin)
                // these must be set here vs. addBase() above to ensure correct css specificity
                ...getTailwindTypographyPaletteCssVariables(typographyOptions),
              },
            },
          },
        },
      },
    }
  },
)

/**
 * Given a project theme definition with values for light and dark mode as a tuple array or string (if the value
 * is the same for both modes), return an object dict of css variables corresponding to the given 'light' or 'dark'
 * `mode` to add to the document css root under the `:root` or `.dark` selectors.
 *
 * RGB hex values in '#000000' format are converted to RGB color channels in the format required by tailwind
 * (i.e. without the color space function) so that opacity is supported when adding to a tailwind config's
 * 'theme.colors' or 'theme.extend.colors'.
 *
 * @param {'light' | 'dark'} mode
 * @param {Object.<string, *>} tx - project theme definition
 * @param {string} path - current nested path in dash (vs. dot) notation for building the css variable name
 *
 * @returns {Object.<string, string>} - css variables to add to document css root
 */
export function getPaletteCssVariables(mode, tx, path = '') {
  const modeIndex = mode === 'light' ? 0 : 1
  const prefix = `--${PALETTE_CSS_VARIABLE_PREFIX}`

  const cssVariables = Object.entries(tx).reduce((acc, [key, value]) => {
    const cssVarName =
      key === 'DEFAULT' ? prefix + `${path ? `-${path}` : ''}` : prefix + `${path ? `-${path}-${key}` : `-${key}`}`

    // handle array case where the value is a tuple of light and dark values
    if (Array.isArray(value)) {
      // assume light and dark value are the same when given a 1-item array (same as string case)
      if (value.length === 1) {
        acc[cssVarName] = formatAsChannelValues(value[0])
        return acc
      }

      if (value.length === 2) {
        acc[cssVarName] = formatAsChannelValues(value[modeIndex])
        return acc
      }

      throw new Error('Invalid palette value. Expected a tuple (array of size 2) with light and dark values.')
    }

    // handle object case by recursing into the object and passing the current path
    if (!!value && typeof value === 'object') {
      return Object.assign(acc, getPaletteCssVariables(mode, value, path ? `${path}-${key}` : key))
    }

    // handle string case where it is assumed that light and dark values are the same
    if (!!value && typeof value === 'string') {
      acc[cssVarName] = formatAsChannelValues(value)
      return acc
    }

    return acc
  }, {})

  return cssVariables
}

/**
 * Get a tailwind colors configuration object for `theme.colors` or `theme.extend.colors` of a tailwind config or
 * preset file based on a project's theme definition.
 *
 * @param {Object.<string, *>} tx - project theme definition
 * @param {string} path - current nested path in dash (vs. dot) notation for building the css variable name
 * @returns {Object.<string, *>} - object to add to tailwind colors config
 */
export function getTailwindConfigColorsObject(tx, path = '') {
  const prefix = `--${PALETTE_CSS_VARIABLE_PREFIX}`

  const twColorsConfig = Object.entries(tx).reduce((acc, [key, value]) => {
    const cssVarName =
      key === 'DEFAULT' ? prefix + `${path ? `-${path}` : ''}` : prefix + `${path ? `-${path}-${key}` : `-${key}`}`

    if (!value) {
      throw new Error('Invalid palette value encountered within tw-theme plugin.')
    }

    // handle case where a tuple array or string value will have a corresponding css variable with the color channels
    if (Array.isArray(value) || typeof value === 'string') {
      // use first item as the test value (assumes that both light and dark values have same alpha if both are present)
      const testValue = Array.isArray(value) ? value[0] : value
      const result = extractChannelValues(testValue)

      switch (result?.type) {
        case 'rgb':
          acc[key] = result?.values?.a
            ? `rgb(var(${cssVarName}) / ${result?.values?.a})` // @future warn if light + dark have different alpha values
            : `rgb(var(${cssVarName}) / <alpha-value>)`
          break
        case 'hsl':
          acc[key] = result?.values?.a
            ? `hsl(var(${cssVarName}) / ${result?.values?.a})` // @future warn if light + dark have different alpha values
            : `hsl(var(${cssVarName}) / <alpha-value>)`
          break
        case 'transparent':
          acc[key] = `var(${cssVarName})` // transparent
          break
        default:
          acc[key] = `var(${cssVarName})`
      }

      return acc
    }

    // handle object case by adding it to the config and recursing in to process its values
    if (typeof value === 'object') {
      acc[key] = getTailwindConfigColorsObject(value, path ? `${path}-${key}` : key)
      return acc
    }

    return acc
  }, {})

  return twColorsConfig
}

/**
 * Return a result object with type of color space and channel values if the given input is a valid color string.
 *
 * This function supports rgb() and hsl() color space functions (and their raw argument values without the function)
 * with or without alpha channel as well as hex color strings.
 *
 * Returns `undefined` if the given input is not a valid or supported color string format, and in the special
 * case of 'transparent' returns an object with `type: 'transparent'` and `values: undefined`.
 *
 * The unit symbols are always included on `a`, `s`, and `l` values and conditionally on `h` if it is a
 * `turn` or `deg` css unit value.
 *
 * @param {string} input - input color string.
 * @returns {(RGBValues | HSLValues | TransparentValue | undefined)} - object containing the type of color and its channel values, or undefined if the input is invalid.
 */
function extractChannelValues(input) {
  if (typeof input !== 'string') {
    return undefined
  }

  if (input === 'transparent') {
    return {
      type: 'transparent',
      values: undefined,
    }
  }

  if (input.startsWith('#')) {
    const result = hexToRgb(input)
    return result
      ? {
          type: 'rgb',
          values: {
            r: String(result.r),
            g: String(result.g),
            b: String(result.b),
            a: undefined,
          },
        }
      : undefined
  }

  const rgbMatch = input.match(RGB_CHANNEL_VALUES_REGEX)

  if (rgbMatch) {
    return {
      type: 'rgb',
      values: {
        r: rgbMatch[1],
        g: rgbMatch[2],
        b: rgbMatch[3],
        a: rgbMatch?.[4] ?? undefined,
      },
    }
  }

  const hslMatch = input.match(HSL_CHANNEL_VALUES_REGEX)

  if (hslMatch) {
    return {
      type: 'hsl',
      values: {
        h: hslMatch[1],
        s: hslMatch[2],
        l: hslMatch[3],
        a: hslMatch?.[4] ?? undefined,
      },
    }
  }

  return undefined
}

/**
 * Format an input color as a string with only channel values e.g. `255 115 179` (RGB) or `300 100% 50%` (HSL)
 * i.e. for use as an input argument to a css color space function such as `rgb()` or `hsl()`.
 *
 * This format is required for tailwind when defining `theme.colors` and `theme.extend.colors` values so that
 * the opacity modifier can be supported.
 *
 * @param {string} color
 */
function formatAsChannelValues(color) {
  const result = extractChannelValues(color)

  switch (result?.type) {
    case 'rgb': {
      const { r, g, b, a } = result.values ?? {}
      return a ? `${r} ${g} ${b} / ${a}` : `${r} ${g} ${b}`
    }
    case 'hsl': {
      const { h, s, l, a } = result.values ?? {}
      return a ? `${h} ${s} ${l} / ${a}` : `${h} ${s} ${l}`
    }
    case 'transparent': {
      return 'transparent'
    }

    // fallback by returning the value as-is vs. throwing an error for support of other formats
    // the fallback case includes the key case of when the given color is already a string of channel values
    //
    // @future add strict support for oklab, oklch, lab, lch, hwb, etc. (note: tailwind support currently lags here)
    default: {
      return color
    }
  }
}

/**
 * Return a Record (object mapping) of css variables for tailwind typography plugin css variables.
 * Refer to `tailwind.typography.js` and `tailwind.preset.js` for the application of this palette.
 *
 * Dark mode is supported via the `tw-prose-invert-*` css variables.
 *
 * If using `@astrojs/mdx` and shiki syntax highlighting some of these values may be overridden by
 * the direct `style` attribute on the pre element. See `tailwind.palette.js` for more details.
 *
 * @returns {Object.<string, string>} - css variables to add to tailwind typography plugin config
 *
 * @future support more than rgb channel values (revise so this processing can be better aware of color space)
 *
 * @see https://tailwindcss.com/docs/typography-plugin#adding-custom-color-themes
 * @see https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
 */
export function getTailwindTypographyPaletteCssVariables(options = { applyAlpha: true }) {
  // object mapping of tailwind typography plugin css variable keys to project css variable names
  // `P` css variables should generally be raw rgb or hsl channel values (without color space function of `rgb()` or `hsl()`)
  const proseToCssVarsDict = {
    body: '--P-content-copy',
    headings: '--P-content-heading',
    lead: '--P-content-lead',
    links: '--P-content-link',
    bold: '--P-content-copy',
    counters: '--P-content-copy',
    bullets: '--P-content-list-bullet',
    hr: '--P-content-divider',
    quotes: '--P-content-heading',
    'quote-borders': '--P-content-divider',
    captions: '--P-content-caption',
    kbd: '--P-content-heading',

    // @future additional support for kbd
    // kbd-shadows: '--P-content-heading-rgb', // needs the rgb for shadows
    // '--tw-prose-kbd-shadows': hexToRgb(theme('colors.slate.900')), // might be special case

    code: '--P-content-code',
    'pre-code': '--P-content-code',
    'pre-bg': '--P-box',
    'th-borders': '--P-content-table-th',
    'td-borders': '--P-content-table-td',

    // @future consider special case if relative using transparency e.g.
    // '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
  }

  const palette = ['--tw-prose', '--tw-prose-invert'].reduce((acc, prefix) => {
    Object.entries(proseToCssVarsDict).forEach(([key, value]) => {
      if (value.startsWith('--P-content')) {
        acc[`${prefix}-${key}`] = `rgb(var(${value}) / ${options.applyAlpha ? '0.95' : '1'})`
      } else {
        acc[`${prefix}-${key}`] = `rgb(var(${value}))`
      }
    })

    return acc
  }, {})

  return palette
}

/**
 * Converts a hex color string to a triple array of individual RGB channel values (as base 10 integers).
 * Returns `undefined` if the given hex string is invalid.
 *
 * @param {string} hex - input hex color string
 * @returns {{r: number, g: number, b: number}|undefined} - triple representing the RGB channel values or undefined
 */
export function hexToRgb(hex) {
  // ensure the hex code starts with '#' and is either 7 or 4 characters long
  if (typeof hex !== 'string' || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(hex)) {
    return undefined
  }

  // expand shorthand form (e.g. "#03F") to full form (e.g. "#0033FF")
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }

  // return extracted values with conversion from hex to decimal
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

/**
 * Convert an input hex color string e.g. `#ff00ff` to a string of RGB channel values e.g. `255 0 255`.
 *
 * This values-only format is required for tailwind when defining values in `theme.colors` and `theme.extend.colors`
 * so that the opacity modifier can be supported.
 *
 * Returns `undefined` if the given hex string is invalid.
 *
 * @param {string} hex - input hex color string
 * @returns {string|undefined} - triple representing the RGB channel values or undefined if invalid
 */
export function rgbToCssVar(hex) {
  const channels = hexToRgb(hex)
  return !!channels && typeof channels === 'object' ? `${channels.r} ${channels.g} ${channels.b}` : undefined
}

export default themePalettePlugin
