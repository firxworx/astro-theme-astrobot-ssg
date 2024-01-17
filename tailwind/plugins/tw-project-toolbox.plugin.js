import plugin from 'tailwindcss/plugin'

/**
 * Custom TailwindCSS plugin that provides a handful of variants and utilities that are
 * often helpful in projects.
 */
const projectToolboxPlugin = plugin(
  /**
   * Add custom variants and utilities.
   */
  function ({ addVariant, addUtilities, theme: _theme }) {
    // assorted custom variants
    addVariant('children', '& > *')
    addVariant('not-first', '&:not(:first-child)')
    addVariant('not-last', '&:not(:last-child)')
    addVariant('not-first-not-last', '&:not(:first-child):not(:last-child)')

    // scrollbar variants
    addVariant('scrollbar', '&::-webkit-scrollbar')
    addVariant('scrollbar-track', '&::-webkit-scrollbar-track')
    addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb')

    // @see https://github.com/tailwindlabs/tailwindcss.com/blob/master/tailwind.config.js for @supports reference
    addVariant('supports-backdrop-blur', '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))')
    addVariant('supports-scrollbars', '@supports selector(::-webkit-scrollbar)')

    // @see https://github.com/tailwindlabs/tailwindcss/issues/11384 for "hocus" and "group-hocus" (hover+focus combo)
    addVariant('hocus', ['&:hover', '&:focus'])
    addVariant('group-hocus', [':merge(.group):hover &', ':merge(.group):focus &'])

    // add .animation-delay-100 to .animation-delay-900
    addUtilities({
      ...Array.from({ length: 9 }, (_, i) => i).reduce(
        (acc, i) => ({ ...acc, [`.animation-delay-${i * 100}`]: { animationDelay: `0.${i}s` } }),
        {},
      ),
    })
  },

  /**
   * Extend the tailwind theme.
   */
  function () {
    return {
      theme: {
        extend: {
          /**
           * Add opacity values from 1-9 in steps of 1.
           * Tailwind v3.4+ adds steps of 5 (vs. former steps of 10) however it's useful to have 1-9 fine-tune values
           */
          opacity: {
            ...Array.from({ length: 9 }, (_, i) => 1 + i).reduce((acc, curr) => ({ ...acc, [curr]: `0.0${curr}` }), {}),
          },
        },
      },
    }
  },
)

export default projectToolboxPlugin
