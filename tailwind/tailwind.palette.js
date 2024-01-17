// @ts-check
import { slate, cyan } from 'tailwindcss/colors'
import { lighten, darken } from './lib/tailwind.utils'

/**
 * TailwindCSS colours referenced by the project's theme palette definition.
 */
const colors = {
  neutral: slate,
  brand: cyan,
}

/**
 * Primary color applied to buttons, links, etc.
 * The key `copy` refers to the shade of primary color to use for copywriting (text).
 *
 * The `copy` color is adjusted to meet WCAG 2.0 AA contrast guildelines vs. the current background color.
 *
 * @type {{ [key: string]: string | [string] | [string, string] }}
 */
const primary = {
  copy: [darken(colors.brand['700'], 0.03), lighten(colors.brand['600'], 0.045)],
  light: [colors.brand['600'], colors.brand['600']],
  DEFAULT: colors.brand['700'],
  hover: [lighten(colors.brand['700'], 0.02), lighten(colors.brand['700'], 0.02)],
  dark: colors.brand['800'],
  fg: [colors.neutral['100'], colors.neutral['100']],
}

/**
 * Neutral color is the _gray-ish_ color that coordinates with layout and primary.
 *
 * @type {{ [key: string]: string | [string] | [string, string] }}
 */
const neutral = {
  ...colors.neutral,
}

/**
 * Primary color copywriting (text) under body and main area with good contrast vs. the background.
 * @type {[string, string]}
 */
const copy = [colors.neutral['700'], colors.neutral['300']]

// body and main content area
const mainBackground = [colors.neutral['200'], colors.neutral['800']]
const mainBackgroundHover = [darken(String(mainBackground[0]), 0.025), darken(String(mainBackground[1]), 0.015)]
const mainOutline = [colors.neutral['300'], colors.neutral['700']]

// header and footer
const layoutBlockBackground = [colors.neutral['700'], darken(colors.neutral['800'], 0.04)]
const layoutBlockBackgroundHover = [
  lighten(String(layoutBlockBackground[0]), 0.01),
  darken(String(layoutBlockBackground[1]), 0.01),
]
const layoutBlockForeground = lighten(colors.neutral['400'], 0.1)
const layoutBlockDivider = layoutBlockBackground.map((color) => lighten(color, 0.04))

/**
 * Helper to pick a single color value from a plugin-supported palette value
 * e.g. from  `primary` light or dark theme.
 *
 * @param {string | [string] | [string, string] | undefined} input
 * @param {'light' | 'dark'} scheme
 * @returns {string}
 * @throws if an unsupported `input` value is encountered (including `undefined`)
 */
const pickColor = (input, scheme) => {
  if (typeof input === 'string') {
    return input
  }

  if (Array.isArray(input) && (input.length === 1 || input.length === 2)) {
    return input.length === 1 ? input[0] : input[scheme === 'light' ? 0 : 1]
  }

  throw Error(`Invalid color input value: ${input}`)
}

/**
 * The project's _Theme Palette Definition_ object for input to the custom tw-theme-palette plugin.
 *
 * Refer to the project's `theme.preset.js` for:
 *
 * - tw-theme-palette plugin configuration that passes in this palette definition
 * - definition of base css styles that apply palette colors to core structural elements of the layout
 *
 * The `content` property is 'special' for the tw-theme-palette plugin because is used to map colors
 * for the tailwindcss/typography plugin's `prose` classes (refer to doc comments and plugin source for details).
 *
 * A palette definition can be as simple or as elaborate as you like.
 *
 * You can easily add to it or modify it as you work on your layout and components to centralize color definitions
 * and streamline the process of adding tailwind color utility classes with support for light/dark theming.
 *
 * @returns {Object.<string, *>}
 * @see tailwind.preset.js for tailwind preset that applies this theme via tw-theme-palette plugin
 * @see tw-theme-palette-plugin.md under docs/ for more information on the plugin and how to define colors
 */
export const projectThemePaletteDefinition = {
  /**
   * When you add your own properties here in a supported format the plugin will automatically generate css variables
   * and tailwindcss color utility classes for them following the `-P-` naming convention.
   *
   * @tip in VSCode you can check the the 'Tailwind CSS IntelliSense' extension output channel for processing errors
   * @tip project convention treats default colors for bg and uses `fg` for foreground (except under `content` key)
   */

  // generate css variables and color utilities for primary, neutral, etc.
  primary,
  neutral,

  // key structural elements (@see tailwind.preset.js for application of the resulting color utilities to base css)
  layout: {
    header: {
      DEFAULT: layoutBlockBackground,
    },
    main: {
      DEFAULT: mainBackground,
      hover: mainBackgroundHover,
      border: mainOutline,
    },
    footer: {
      DEFAULT: layoutBlockBackground,
      fg: layoutBlockForeground,
    },
    divider: layoutBlockDivider,
  },

  // nav menu palette for (@see Nav component and BaseLayout)
  nav: {
    menu: {
      DEFAULT: layoutBlockBackground,
    },

    // buttons include dark/light theme switcher and mobile nav menu button
    button: {
      DEFAULT: 'transparent',
      hover: layoutBlockBackgroundHover,
      fg: layoutBlockForeground,
    },

    // values are used as foreground colors
    logo: {
      DEFAULT: layoutBlockForeground,
      hover: [colors.neutral['200'], colors.neutral['300']],
    },

    // values are used as foreground colors for nav menu links
    link: {
      DEFAULT: layoutBlockForeground,
      hover: primary.light,
      current: [colors.neutral['200'], colors.neutral['300']],
    },
  },

  // pre+code blocks (@see tailwind.shiki.js for use of the css variable generated by this plugin)
  code: {
    block: {
      DEFAULT: [colors.neutral['700'], darken(colors.neutral['800'], 0.05)],
    },
  },

  // box refers to a generic container element with a background color that coordinates with the main background color
  box: {
    DEFAULT: [colors.neutral['300'], colors.neutral['700']],
    fg: copy,
    outline: mainOutline,

    // box-inside-a-box
    inset: {
      DEFAULT: [colors.neutral['200'], colors.neutral['800']],
      fg: [colors.neutral['800'], colors.neutral['200']],
    },
  },

  // the following hero is detailed to provide plenty of examples of the palette definition in action
  // it's your decision when to specify colors here vs. when to hardcode them in a special/unique elements like a hero
  hero: {
    DEFAULT: colors.neutral['700'],
    fg: {
      DEFAULT: colors.neutral['50'],
    },
    caption: {
      fg: colors.neutral['300'],
    },
    button: {
      primary: {
        DEFAULT: colors.neutral['100'],
        hover: colors.neutral['300'],
        fg: {
          DEFAULT: colors.neutral['700'],
          hover: primary,
        },
        border: {
          DEFAULT: 'transparent',
          hover: 'transparent',
        },
      },
      alt: {
        DEFAULT: 'transparent',
        hover: lighten(colors.neutral['700'], 0.02),
        fg: {
          DEFAULT: colors.neutral['50'],
          hover: primary.light,
        },
        border: {
          DEFAULT: colors.neutral['100'],
          hover: primary,
        },
      },
    },
  },

  /**
   * Content colors are used as foreground colors in this project convention and should be legible vs. the bg color.
   * The plugin maps these values for `@tailwindcss/typography` and generates css variables to set prose styling.
   *
   * At this time the plugin only handles **RGB color channel values** for mapping to typography/prose
   * (feel free to submit a PR to make the plugin more flexible).
   *
   * The `copy` key refers to 'copywriting' (text foreground).
   */
  content: {
    heading: [colors.neutral['700'], colors.neutral['300']],
    copy: {
      DEFAULT: copy,
      muted: [lighten(pickColor(copy, 'light'), 0.1), darken(pickColor(copy, 'dark'), 0.1)],
    },
    code: [colors.neutral['600'], colors.neutral['400']],
    caption: [colors.neutral['600'], lighten(colors.neutral['500'], 0.04)],
    lead: [colors.neutral['600'], colors.neutral['400']],
    divider: [colors.neutral['600'], colors.neutral['200']],
    link: {
      DEFAULT: primary.copy,
      hover: [lighten(pickColor(primary.copy, 'light'), 0.02), darken(pickColor(primary.copy, 'dark'), 0.08)],
    },
    list: {
      bullet: [colors.neutral['400'], colors.neutral['600']],
    },
    table: {
      th: [colors.neutral['300'], colors.neutral['500']],
      td: [colors.neutral['300'], colors.neutral['600']],
    },
  },
}
