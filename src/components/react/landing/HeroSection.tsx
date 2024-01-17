import { cn } from '@helpers/style'
import type { NavLink } from '@/types/site.types'

export interface HeroSectionProps {
  heading: string
  blurb: string
  primaryLinkButton: NavLink
  outlineLinkButton?: NavLink
  className?: string
}

const headingGradientClassName =
  'bg-gradient-to-r from-green-300 via-blue-400 to-purple-300 bg-clip-text text-transparent'

const buttonBaseClassName = cn(
  'block w-full rounded border-2 px-4 sm:px-8 sm:px-12 py-3 sm:w-auto max-w-sm transition-colors',
  'text-sm sm:text-base font-medium whitespace-nowrap',
  'active:text-opacity-90',
  'cx-focus-visible focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
)

/**
 * Hero section for the landing page with a rainbow gradient heading and CTA buttons.
 *
 * This component uses a lot of palette colors defined in `tailwind/tailwind.palette.js` to help
 * demonstrate how the plugin generates color utilities.
 */
export function HeroSection({
  heading,
  blurb,
  primaryLinkButton,
  outlineLinkButton,
  className,
}: HeroSectionProps): JSX.Element {
  return (
    <section className={cn('backdrop:rounded-md bg-P-hero text-P-hero-fg', className)}>
      <div className="w-full max-w-screen-2xl px-4 py-12 sm:py-16 lg:flex lg:items-center">
        <div className="w- mx-auto max-w-3xl text-center">
          <h1 className={cn(headingGradientClassName, 'text-3xl sm:text-4xl md:text-5xl font-extrabold text-balance')}>
            {heading}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-P-hero-caption-fg/95 sm:text-lg/relaxed md:text-xl/relaxed">
            {blurb}
          </p>

          <div className="mx-auto mt-8 flex w-full flex-wrap justify-center gap-2 px-6 xs:max-w-sm xs:flex-nowrap xs:px-4 sm:gap-4 sm:px-0">
            <PrimaryLinkButton href={primaryLinkButton.href}>{primaryLinkButton.text}</PrimaryLinkButton>
            {!!outlineLinkButton && (
              <OutlineLinkButton href={outlineLinkButton?.href}>{outlineLinkButton?.text}</OutlineLinkButton>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function PrimaryLinkButton({ href, children }: React.PropsWithChildren<Pick<NavLink, 'href'>>): JSX.Element {
  return (
    <a
      className={cn(
        buttonBaseClassName,
        'text-P-hero-button-primary-fg/95 hover:text-P-hero-button-primary-fg-hover/95',
        'border-P-hero-button-primary-border hover:border-P-hero-button-primary-border-hover',
        'bg-P-hero-button-primary hover:bg-P-hero-button-primary-hover',
      )}
      href={href}
    >
      {children}
    </a>
  )
}
export function OutlineLinkButton({ href, children }: React.PropsWithChildren<Pick<NavLink, 'href'>>): JSX.Element {
  return (
    <a
      className={cn(
        buttonBaseClassName,
        'text-P-hero-button-alt-fg/95 hover:text-P-hero-button-alt-fg-hover/95',
        'bg-P-hero-button-alt hover:bg-P-hero-button-alt-hover',
        'border-P-hero-button-alt-border hover:border-P-hero-button-alt-border-hover',
      )}
      href={href}
    >
      {children}
    </a>
  )
}
