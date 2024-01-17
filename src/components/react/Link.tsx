import { ASTRO_SITE_URL } from '@config'
import { cn } from '@helpers/style'

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disabled?: boolean
}

/**
 * A link (anchor) component for links in main content area.
 *
 * - Supports a `disabled` prop with functionality similar to an HTML button.
 * - Automatically adds `target="_blank"` with `rel` attributes to any external links.
 */
export function Link({
  className,
  tabIndex,
  disabled: isDisabled = false,
  children,
  ...restProps
}: LinkProps): JSX.Element {
  const isExternal =
    typeof restProps.href === 'string' &&
    restProps.href.startsWith('http') &&
    !restProps.href.startsWith(ASTRO_SITE_URL)

  return (
    <a
      tabIndex={isDisabled ? -1 : tabIndex}
      className={cn(
        'font-medium no-underline hover:underline cx-focus cx-focus-rounded',
        {
          ['opacity-50 pointer-events-none']: isDisabled,
        },
        className,
      )}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-disabled={isDisabled ? 'true' : undefined}
      {...restProps}
    >
      {children}
    </a>
  )
}
