# Astrobot Docs: Patterns for Customization, Composability, and Reusability

This doc provides an overview of design patterns & philosophies in the theme's codebase that promote customization, composability, and reusability.

## Tailwind Centralization

In a codebase with Astro, React, and Tailwind there are _a lot_ of places to define both global and local styles that can then trip over each other and cause conflicts.

This theme embraces tailwind and uses it in a way that keeps various "things" defined in a single spot for maintainability and customizability.

- The entire project's tailwind customizations are encapsulated within a reusable tailwind preset
- Global styles and custom css classes are _only_ defined in the preset and never in any `.css` file or Astro `global`
- The custom `tw-theme-palette` tailwind plugin enables centralizing palette color definitions to a single file (`tailwind.palette.js`) which is applied to tailwind color utility classes, the tailwind/typography plugin, Astro-shiki syntax highlighting, and any other integration you may wish to add (thanks to CSS variables)

It is up to you what to define as a global style or custom css class (if any). However we recommend centralizing everything in the preset when using Tailwind and being mindful that custom classes introduce an external dependency on components.

More details on customizing the styling are at: [Astrobot Docs: Customization & Styling with TailwindCSS](./astrobot-customization-styling.md)

## Tailwind `cn()` Utility and `tailwind-merge`

The majority of components accept either an optional `className` (React) or `class` (Astro) prop which is then applied to the component's parent/wrapping element (or a reasonable alternative) using the `cn()` utility.

The `cn()` utility combines the functionality of the legendary `clsx()` helper from the [clsx](https://www.npmjs.com/package/clsx) package with the powerful and popular [tailwind-merge](https://www.npmjs.com/package/tailwind-merge).

This pattern enables parents to override the styling of components and apply classes for margins, positioning, etc. without the need for a wrapper.

Although clsx is implemented independently within the codebase, it can be used exactly as documented on the package's npm page and README: https://www.npmjs.com/package/clsx.

You can search for "cn tailwind-merge" for articles and examples of the `cn()` pattern.

## Positioning is Responsibility of Parents/Layouts

Layouts are easier to customize and are generally more maintainable when top-level layouts and parent-level components that compose one or more child components can serve as the "master" for all margins/positioning/etc.

The majority of Astro and React components in the project are designed to be "self-contained" such that any layout or component that imports it has free reign to position, align, etc. in isolation.

Components do not hard-code margins or other styles that affect their positioning or otherwise "pollute" styles beyond their own boundaries.

Where components use layers (z-index) the parent resets the z-index back to 0 where feasible.

Components created with this philosophy are more reusable and easier to maintain because they don't have finnicky dependencies on how they are used alongside other components or in any particular layout.

The application of css classes / tailwind utilities related to layout, placement, and external positioning such as margins is specified at the parent level, either in a layout, or the parent component in the case of a component that composes multiple components such as a `Pagination` component (which can arrange links, buttons, etc).

## Icon Components

Reusable icon components such as SVG icons do not hardcode any palette colors. They apply `currentColor` and enable styles applied by the parent to define the foreground color.
