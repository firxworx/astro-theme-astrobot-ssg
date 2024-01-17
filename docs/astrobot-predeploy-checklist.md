# Astrobot Docs: Predeploy Checklist

Clearing this checklist helps make sure that you are ready to deploy your customized site to production.

## Checklist

- environment variable values are suitable for production
  - review values in all `.env*` files
  - ensure CI/CD and/or host environment/configuration has correct values set for production
- meta tags for SEO meet required format and are correct for deploy
- `site` property is correctly defined in `astro.config.mjs` and related env values are defined for build/production
- all internal links and urls/pathnames respect the `trailingSlash` setting per `astro.config.mjs`
- confirm layout `head` has a `<link ...>` tag that points to the sitemap created during build
- confirm canonical URL is configured in layout `head` for SEO and navigation purposes
- `src/pages/robots.txt.ts` is customized per your requirements and it references the sitemap file generated in `dist/` folder
- any custom fonts (if any) are being correctly loaded using dev tools and implement any fallback fonts
- tailwindcss is properly purging unused classes for optimized css output
- no secrets or confidential information is being disclosed in client-side/client-visible code
- no sensitive or unintended files are accidentally included in the build or copied to the hosting environment
- favicon e.g. `public/favicon.svg` matches your brand/logo and is correctly referenced in `<head>..</head>`
- consider a `public/favicon.ico` fallback for any clients that may request it (can help avoid 404 litter in logs) otherwise delete it
- your intended logo is used on both the layout _and_ social media (open graph) image templates
- the social media (open graph) image template design meets your requirements (`PostImageTemplate`, `SiteImageTemplate`)
- 404 page is how you like it
- all relevant pages under `src/pages` have been replaced or customized
- QA the responsive styles of the production build (desktop + mobile), check all links, confirm component functionality

Optional considerations:

- adding configuration for a bug-reporting/bug-tracking service
- adding analytics service configuration

Recommended:

- run PageSpeed Insights and other performance measurement and accessibility auditing tools
