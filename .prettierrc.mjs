/**
 * Project prettier configuration.
 * Another plugin to consider: `prettier-plugin-tailwindcss`
 *
 * @see https://github.com/withastro/prettier-plugin-astro
 *
 * @type {import("prettier").Config}
 */
export default {
  plugins: ['prettier-plugin-astro'],
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  bracketSpacing: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
