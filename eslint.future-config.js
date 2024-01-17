/**
 * Project ESLint configuration (eslint.config.js)
 *
 * @future CURRENTLY NOT IN USE PENDING FULL SUPPORT BY ESLINT EXTENSIONS + VSCODE @see .eslintrc.cjs
 *
 * Per https://eslint.org/docs/latest/use/configure/configuration-files-new this file should work as the new
 * eslint configuration when named `eslint.config.js` and placed in project root.
 *
 * However at present VSCode eslint complains that no configuration is found so a legacy `.eslintrc.cjs` was added in
 * the meantime as a stop-gap. Please refer to `.eslintrc.cjs` for the time being.
 *
 * Note: also refer to docs for `ESLINT_USE_FLAT_CONFIG` environment variable flag.
 *
 * @see https://github.com/ota-meshi/eslint-plugin-astro
 * @see https://ota-meshi.github.io/eslint-plugin-astro/user-guide/
 * @see https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new docs for the new eslint config file format
 */
export default [
  {
    root: true,
    plugins: ['react-refresh'],
    extends: [
      'eslint:recommended',
      'plugin:astro/recommended',
      'plugin:prettier/recommended', // enables eslint-plugin-prettier and eslint-config-prettier
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:tailwindcss/recommended',
      'plugin:@tanstack/eslint-plugin-query/recommended',
    ],
    rules: {
      semi: 'warn',
      'prefer-const': 'error',
      'tailwindcss/no-custom-classname': 'off', // disable for noise
      // '@typescript-eslint/consistent-type-imports': 'error', // this is also enforced via astro v3 tsconfig
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    overrides: [
      {
        // astro-specific eslint rules
        files: ['*.astro'],

        // enable parsing of astro components
        parser: 'astro-eslint-parser',

        // parse script in `.astro` as TypeScript (required to enable typescript features)
        parserOptions: {
          parser: '@typescript-eslint/parser',
          extraFileExtensions: ['.astro'],
          sourceType: 'module',
        },
        rules: {
          // the following recommended rules are enabled by the preset plugin:astro/recommended
          // 'astro/no-conflict-set-directives': 'error',
          // 'astro/no-unused-define-vars-in-style': 'error',
          //
          // override/add rules settings here, such as:
          // "astro/no-set-html-directive": "error"
        },
      },
      {
        files: ['*.ts', '*.tsx'],
        // extends: ['plugin:@nx/typescript'],
        rules: {
          // our convention is for all 'top-level' components to export a corresponding props interface even if empty
          '@typescript-eslint/no-empty-interface': 'off',

          // computed keys are a common pattern in clsx/cn and similar styling utilities
          'no-useless-computed-key': 'off',

          // require explicit declaration of function returns even for react -- deal with it!
          '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
              allowExpressions: true,
            },
          ],
        },
      },
      {
        files: ['*.tsx'],
        rules: {
          'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn',
          'react/no-unescaped-entities': 'warn',
          'react/prop-types': 'off', // prop-types is not required for typescript projects
        },
      },
    ],
    ignorePatterns: [
      'build',
      'dist',
      '.eslintrc.{js,cjs,ts,mjs}',
      '.eslint.config.js',
      'node_modules',
      '!.prettierrc.mjs',
    ],
  },
]
