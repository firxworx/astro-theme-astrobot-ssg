/**
 * Return a Record (object mapping) of css variables for Astro Shiki syntax highlighting for the given `mode`.
 * Refer to `astro.config.mjs` for the shiki configuration powered by `@astrojs/mdx`.
 *
 * @see https://github.com/shikijs/shiki/blob/main/docs/themes.md#theming-with-css-variables
 */
export const getAstroShikiPaletteCssVariables = (mode, theme) => {
  if (typeof theme !== 'function') {
    throw new TypeError('Argument `theme` is not a function. Expected tailwind theme() function.')
  }

  // the following shiki palette was customized from an example found at:
  // https://christianpenrod.com/blog/astro-shiki-syntax-highlighting-with-css-variables/

  const shikiLightPalette = {
    '--astro-code-color-text': 'azure',
    '--astro-code-color-background': 'rgb(var(--P-code-block))',
    '--astro-code-token-constant': 'plum',
    '--astro-code-token-string': 'orchid',
    '--astro-code-token-comment': 'salmon',
    '--astro-code-token-keyword': 'powderblue',
    '--astro-code-token-parameter': 'seashell',
    '--astro-code-token-function': 'dodgerblue',
    '--astro-code-token-string-expression': 'burlywood',
    '--astro-code-token-punctuation': 'linen',
    '--astro-code-token-link': 'honeydew',
    '--astro-code-token-operator': 'lightcyan',
  }

  // this project currently uses the same palette for both the light + dark theme
  // you can define a unique dark theme here based on the above example --
  const shikiDarkPalette = shikiLightPalette

  return mode === 'light' ? shikiLightPalette : mode === 'dark' ? shikiDarkPalette : undefined
}
