import { cn } from '@helpers/style'

export interface ExampleComponentProps {
  className?: string
}

/**
 * A trivial React component that renders a celebratory emoji.
 * This component is used to demonstrate the Astro react integration.
 */
export function ExampleComponent({ className }: ExampleComponentProps): JSX.Element {
  return (
    <div className={cn('grid place-items-center p-4 rounded-md bg-P-box text-P-box-fg/95', className)}>
      <div className="mb-1 animate-bounce pb-1 text-2xl">🍒</div>
      <div className="text-sm font-medium text-P-content-copy/90">React Component</div>
    </div>
  )
}
