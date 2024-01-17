import { loadEnv } from 'vite'
import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

const ENV = loadEnv(process?.env?.['NODE_ENV'] || import.meta.env.MODE, process.cwd(), '')

/**
 * Astro configuration.
 * Please take care when adding integrations or plugins via the astro cli as it may overwrite or clobber this file.
 *
 * @see https://astro.build/config
 * @see https://docs.astro.build/en/reference/configuration-reference/
 *
 * @see https://docs.astro.build/en/guides/upgrade-to/v3/
 *
 * @type {import('astro').AstroConfig}
 */
export default defineConfig({
  // site url is required for canonical urls and sitemap (for prod use a full url including the protocol)
  site: ENV['ASTRO_CONFIG_SITE_URL'] || 'localhost:4321',

  // ensure static-site (SSG) vs.'server' or 'hybrid' modes (SSR)
  output: 'static',

  // configure dev server to only match url's with trailing slash vs. default 'ignore' for consistency w/ production
  // **this should ideally be set to 'always' or 'never' for consistency and bug safety however there is an issue**
  // @see https://github.com/withastro/astro/issues/9674
  // @todo remove comment when trailingSlash issue resolved (#9674)
  // trailingSlash: 'always', // 'always' is assumed within this codebase

  // generate directories with nested index.html i.e. /foo/index.html (explicit declaration of the default behaviour)
  build: {
    format: 'directory',
  },

  // explicitly set the astro dev server port (the default for Astro v3+ is 4321)
  server: { port: Number(ENV.ASTRO_CONFIG_PORT || '4321') },

  // @see https://astro.build/integrations/
  integrations: [
    // @see https://docs.astro.build/en/guides/integrations-guide/tailwind/
    tailwind({
      // @tip specifying an explicit configFile can help for smoother monorepo compatibility
      // configFile: path.resolve(workspaceRoot, ASTRO_APP_DIR, 'tailwind.config.js'),
    }),

    // @see https://docs.astro.build/en/guides/integrations-guide/react/
    react({
      experimentalReactChildren: true,
    }),

    // @see https://docs.astro.build/en/guides/integrations-guide/mdx/
    // @tip mdx inherits from the `markdown` config -- mdx overrides may be specified here
    mdx(),

    // @see https://docs.astro.build/en/guides/integrations-guide/sitemap/
    // @tip ensure `site` is set and add a `link` tag to layout head and ensure sitemap is included in `robots.txt`
    sitemap({
      // @tip you can filter pages from the sitemap to remove pages that should not be indexed
      // filter: (page) => page !== `${ENV['ASTRO_CONFIG_SITE_URL']}/secret-area/',
    }),
  ],

  // customize markdown support (this config is also inherited by the mdx integration)
  // @see `tailwind/tailwind.palette` for css variable definitions for `@astrojs/mdx` syntax highlighting via shiki remark plugin
  // @see https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting
  // @see https://github.com/shikijs/shiki/blob/main/docs/themes.md#loading-theme
  // @see https://docs.astro.build/en/guides/integrations-guide/mdx/
  // @see https://astexplorer.net/ for debugging MDX AST's
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      // refer to tailwind.preset.js for shiki css variable definitions
      theme: 'css-variables',

      // wrap prevents horizontal scrolling in code blocks (if `false` you may want css `overflow-x` to scroll)
      wrap: true,

      // other options to consider --
      // experimentalThemes: {
      //   light: 'github-light',
      //   dark: 'github-dark',
      // },
      // langs: [], // custom programming langauges
    },
    gfm: true,

    // @tip example of adding remark plugins
    // remarkPlugins: [remarkPlugin],
  },

  // @tip customize vite, rollup, and esbuild configuration using the following properties
  vite: {
    // esbuild: { exclude: [] },
    build: {
      // assets: '_custom' // custom assets directory (e.g. build output css + js files)
      // assetsPrefix: 'https://cdn.example.com' // custom assets prefix (e.g. CDN URL)
      // rollupOptions: {
      //   output: {},
      // },
    },
    optimizeDeps: { exclude: ['@resvg/resvg-js'] },
  },

  // @tip configure an SSR adapter or add support for a specialized hosting provider via the `adapter` property
  // adapter: node({
  //   mode: 'standalone',
  // }),

  // @tip define explicit paths for custom directory structures -- this can help with scripting and monorepo support
  // outDir: path.resolve('dist'),
  // srcDir: path.resolve('src'),
  // publicDir: path.resolve('public'),
})
