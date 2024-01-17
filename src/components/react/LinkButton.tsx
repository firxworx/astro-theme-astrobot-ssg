import { ASTRO_SITE_URL } from '@config'
import { cn } from '@helpers/style'

export interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disabled?: boolean
}

/**
 * A link (anchor) component styled like a button and with support for a `disabled` prop similar to an HTML button.
 *
 * Automatically adds `target="_blank"` with `rel` attributes to external links. Pass `rel` or `target` via
 * props to override this behavior.
 *
 * @todo button-like style
 */
export function LinkButton({
  className,
  disabled: isDisabled,
  tabIndex,
  children,
  ...restProps
}: LinkButtonProps): JSX.Element {
  const isExternal =
    typeof restProps.href === 'string' &&
    restProps.href.startsWith('http') &&
    !restProps.href.startsWith(ASTRO_SITE_URL)

  return (
    <a
      tabIndex={isDisabled ? -1 : tabIndex}
      className={cn(
        'font-medium cx-focus cx-focus-rounded no-underline hover:no-underline',
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
