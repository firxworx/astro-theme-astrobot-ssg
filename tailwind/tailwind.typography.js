// import { em, round } from './lib/tailwind.utils'

/**
 * Return a `theme.extend.typography` config object for this project's tailwind preset configuration.
 * Provides custom styling for tailwind `prose*` classes as enabled by the `@tailwindcss/typography` plugin.
 *
 * CSS variables referenced by the typography plugin are managed by the `tw-theme-palette` plugin.
 *
 * @see https://tailwindcss.com/docs/typography-plugin
 * @see https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js default config for reference
 */
export const getTailwindTypographyConfig = (theme) => {
  /**
   * @type {Object.<string, *>}
   */
  const proseConfig = {
    DEFAULT: {
      css: {
        a: {
          '@apply no-underline font-medium cx-focus cx-focus-rounded': {},
          '&:hover': {
            '@apply underline': {},
          },
        },

        // override default to use bold weight (700) vs. 800 + 900 weight
        ...['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].reduce((acc, curr) => {
          acc[curr] = {
            fontWeight: theme('fontWeight.bold'),
          }
          acc[`${curr} strong`] = {
            fontWeight: theme('fontWeight.extrabold'),
          }
          return acc
        }, {}),

        // astro shiki sets a tabIndex on <pre><code> to make it focusable
        pre: {
          '@apply cx-focus': {},
        },

        // override default behavior of adding backticks around inline <code>
        'code::before': {
          content: '', // default: '"`"',
        },
        'code::after': {
          content: '', // default: '"`"',
        },

        // example of customizing a list --
        // ul: {
        // '> li': {
        //   '&::before': {
        //     // more complex example to add before to an li element.
        //     content: '',
        //     // ....,
        //   },
        // } },
      },
    },

    // further customization can be added below --
    // sm: { css: {} }, // prose-sm
    // lg: { css: {} }, // prose-lg
    // custom: { css: {} } // generates `prose-custom` (you can use any name e.g. `prose-pink`)
  }

  return proseConfig
}
