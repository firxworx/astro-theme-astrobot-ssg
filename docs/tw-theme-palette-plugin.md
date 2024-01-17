# Astrobot Docs: The tw-theme-palette Plugin & Theme Palette Definition

The tw-theme-palette plugin is a custom tailwindcss plugin used in this project to generate CSS variables and tailwindcss color utilities based on a _Theme Palette Definition_ object.

For a general overview of the overall tailwind setup and theme customization refer to [Astrobot Docs: Customization & TailwindCSS](./customization-and-tailwindcss.md).

This doc provides details on how define the project's _Theme Palette Definition_ object in the file `tailwind/tailwind.theme.js`.

The plugin's source code is at `tailwind/plugins/tw-theme-palette.plugin.js`.

## Naming Convention

The plugin follows a naming convention where it prefixes CSS variable and tailwind color utility class names with a capital `P` (for _palette_).

The naming convention follows the hierarchy of the _Theme Palette Definition_ object with each level separated by a dash.

## Theme Palette Definition

For each entry in the palette definition the tw-theme-palette will:

- define CSS variables for light + dark mode that reference the color values
- define CSS variables that apply theme colors under the `content` property to elements styled with the `tailwindcss/typography` plugin's `prose` utilities
- extend the tailwind theme to add tailwindcss color utilities for each of the CSS variables so you can use the palette colors in your theme, preset, and code

The plugin adds the new utilities via `theme.extend.colors` so you can still use all of tailwind's built-in color utilities e.g. `bg-green-500`.

## _Theme Palette Definition_ Object

Consider the following hypothetical _Theme Palette Definition_ object. The entries in the tuple correspond to `[light, dark]`:

```js
{
  header: {
    divider: ['#ff0000', '#00ff00']
  }
}
```

The plugin will generate the CSS variable `--P-header-divider` with value `#ff0000` in light mode and `#00ff00` in dark mode.

The plugin also generates the corresponding tailwindcss color utility `*-P-header-divider` that can be used in your code:

```tsx
<div className="h-[1px] w-full bg-P-header-divider" />
```

Tailwind's opacity modifier is fully supported (if your palette definition values don't include a hardcoded alpha value of their own):

```tsx
<div className="h-[1px] w-full bg-P-header-divider/50" />
```

Note how using plugin-managed color utilities are no different from any other color utility. Consider the following example using the built-in `green-500`:

```tsx
<div className="h-[1px] w-full bg-green-500" />
```

The color will automatically switch in light vs. dark mode because of how the underlying definition is based on the CSS variable.

You can use the generated CSS variable anywhere in the project.

The variables are important for customizing the Astro shiki syntax highlighting and can be helpful when working with other third-party Astro integrations that can be customized by overriding their CSS variables.

## Special `content` Property

The `content` property of a palette definition and the names of its keys are special because they are mapped to the tailwindcss/typography plugin.

This enables you to define colors once in the palette definition and then have them consistently applied across your project.

Since the plugin source code is included in this project's codebase you can customize anything and everything as you wish.

## _Theme Palette Definition_ Object Details

The _Theme Palette Definition_ object supports a range of different input values beyond the simple example above.

### DEFAULT Property

The `DEFAULT` property name is supported in a similar way to tailwind when defining a `theme.colors` or `theme.extend.colors` object in a tailwind config or preset.

The following entries will generate the color utilities `*-P-accordion`, `*-P-accordion-hover`, and `*-P-accordion-fg`:

```js
{
  accordion: {
    DEFAULT: ['255 0 0', '0 255 0']
    hover: ['200 0 0', '0 200 0']
    fg: '255 255 255'
  }
}
```

The following alternative is equivalent to the above:

```js
{
  accordion: {
    DEFAULT: ['255 0 0', '0 255 0']
    hover: ['200 0 0', '0 200 0']
    fg: {
      DEFAULT: '255 255 255'
    }
  }
}
```

### Nesting

An arbitrary level of nesting is supported.

The color utilities added to the preset/theme based on the above example can be used as follows:

```jsx
<Accordion className="bg-P-accordion hover:bg-P-accordion-hover">...</Accordion>

<h3 className="text-P-accordion-fg">Neat</h3>

<h6 className="text-P-accordion-fg/50">50% opacity using tailwind opacity modifier</h6>
```

Each level of nesting is separated by a dash `-` character in plugin-generated CSS variable names and utility class names.

### Supported Values

Color values in the palette definition are string tuples (2-item arrays) where each item corresponds to `[light, dark]` theme.

If a string or 1-item array is provided instead of a tuple then the same value is used for both the light and dark theme.

Color values should be provided as:

- RGB hex strings (e.g. `'#ffffff'`)
- space-separated RGB or HSL _channel values_ in decimal e.g. `255 255 0` (RGB) or `224 71% 4%` (HSL)

HSL values should be specified with unit symbols (`%`).

Both values in a given tuple must correspond to the same color space function: i.e. both of the light and dark colors in any given tuple must share the same RGB or HSL color space.

Examples of supported values in the recommended format:

- `['#ffffff', '#000000']` - RGB hex strings
- `['255 255 255', '0 0 0']` - space-separated RGB channel values
- `['222.2 47.4% 11.2%', '20 5% 5%']` - space-separated HSL channel values
- `'#ffffff'` - a single string value applies to both the light and dark theme
- `'transparent'` - the 'transparent' keyword is supported as a special-case

#### Conveniences

Strings containing an rgb/rgba/hsl/hsla CSS color function value e.g. `rgb(...)` or `hsl(...)` are accepted as a convenience, including with support for both the "old" and "new" optional alpha (opacity) syntax.

This is only intended in cases where you may be reading palette colors in from another source.

However it is not generally recommended for most projects and you risk breaking compatibility with tailwind's opacity modifier.

Examples of supported-but-NOT-recommended values:

- `'rgb(255 255 255)'`
- `'rgb(255 255 255 / 50%)'`
- `'rgb(255 255 255 / 0.5)'`
- `'hsl(0 0% 100%)'`.

### Opacity Modifiers

You should generally specify colors _without_ an alpha channel (opacity) so tailwind's opacity modifier can be supported and will work as expected.

The plugin detects values with no opacity modifier and generates the color utility classes with tailwind's special alpha placeholder.

If you provide a value that includes an alpha/opacity value then the plugin will hard-code it into the CSS variable and tailwind's opacity modifier will not work for that color.

### Non-RGB/Non-HSL Color Spaces and CSS Variable References

If you provide a value using an unsupported color-space function it is not supported however it _might_ still work as it will be passed through to the CSS variable as-is.

References to other css variables are supported.

In both of these cases you will not be able to use the opacity modifier.

The plugin's code is in the repo and you are welcome to revise it to suit your needs.

## VSCode Users & IntelliSense

VSCode users with the TailwindCSS extension will not see color previews in the editor like those that appear with tailwind's built-in colors.

This is because the extension doesn't support previewing color values referenced by CSS variable.

Furthermore it can be argued that it is ambiguous whether light or dark mode should be previewed so nothing is shown.

You can still place your cursor over plugin-generated utility classes and see the underlying definition pop up in IntelliSense.

### Troubleshooting Tip

If you are experiencing issues check the VSCode Output panel for the "Tailwind CSS IntelliSense" channel for any errors while the dev server is running.

Typos and syntax mistakes in any of the preset, plugin, or theme definition files can cause tailwind to break and not generate CSS for your project.
