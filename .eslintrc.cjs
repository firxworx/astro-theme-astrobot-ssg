/**
 * eslint config for project
 *
 * This is a stopgap for VSCode+eslint which appears to not yet support the new `eslint.config.js` format.
 *
 * @see eslint.future-config.js
 * @see https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted
 *
 * @type {import("eslint").Linter.Config}
 */
const config = {
  root: true,
  env: {
    browser: true, // window, document, etc for astro + react client-side code
    node: true, // process, require, etc for astro config and any node scripting
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react-refresh', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:astro/recommended',
    'plugin:prettier/recommended', // enables both `eslint-plugin-prettier` and `eslint-config-prettier`
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',

    // comment out if you find this plugin too noisy or disagree with its opinionated class ordering
    'plugin:tailwindcss/recommended',

    // install the package and uncomment the following if using react-query
    // 'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  rules: {
    // disable no custom classnames as our project may define them in tailwind preset(s) and/or config
    'tailwindcss/no-custom-classname': 'off',

    // prop-types is not required for typescript projects
    'react/prop-types': 'off',

    // custom rule for no unused vars that permits unused variables prefixed with `_`
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

    // consistent type imports are also enforced by the astro tsconfig
    // '@typescript-eslint/consistent-type-imports': 'error',

    // functionality is covered by other rules
    // 'prefer-const': 'error',
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
        // for reference the following rules are enabled via the preset plugin:astro/recommended:
        // 'astro/no-conflict-set-directives': 'error',
        // 'astro/no-unused-define-vars-in-style': 'error',
        //
        // override/add rules settings here, such as:
        // "astro/no-set-html-directive": "error"
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      // extends: ['plugin:@nx/typescript'], // if using within an Nx workspace
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
        'react/react-in-jsx-scope': 'off', // this is handled by compilerOptions.jsxImportSource in tsconfig.json
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
}

// eslint-disable-next-line no-undef
module.exports = config
