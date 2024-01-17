// @ts-check
import tailwindPreset from './tailwind/tailwind.preset.js'

/**
 * TailwindCSS configuration file.
 * Refer to the preset and theme files to customize tailwind for this project.
 *
 * @type {import('tailwindcss').Config}
 */
const tailwindConfig = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  presets: [tailwindPreset],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default tailwindConfig
