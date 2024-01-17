import { cn } from '@helpers/style'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const HEADING_CLASSNAMES = {
  h1: 'text-4xl font-bold mb-6',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-semibold',
  h6: 'text-base font-semibold',
}

/**
 * Heading component that accepts `as` prop to specify the heading element to render.
 *
 * Defaults to `h1` element and applies default tailwind classes for each heading level.
 * If a `className` is provided it is merged with the existing classes using the `cn` helper.
 */
export function Heading({ as: Component = 'h1', className, children, ...restProps }: HeadingProps): JSX.Element {
  return (
    <Component className={cn(HEADING_CLASSNAMES[Component], className)} {...restProps}>
      {children}
    </Component>
  )
}
