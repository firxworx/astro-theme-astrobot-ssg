import { useState } from 'react'
import { cn } from '@helpers/style'
import { Button } from '../Button'

export interface ExampleCounterProps {
  className?: string
}

/**
 * A simple React counter that renders a count and a button for incrementing the count by 1.
 * This component must be loaded into an Astro island with an approrpriate `client` directive to enable interactivity.
 */
export function ExampleCounter({ className }: ExampleCounterProps): JSX.Element {
  const [count, setCount] = useState<number>(0)

  return (
    <div className={cn('grid grid-cols-1 grid-rows-2 gap-4 rounded-md bg-P-box text-P-box-fg/95 p-4', className)}>
      <div className="grid place-items-center">
        <span className={cn('inline-block p-2 min-w-[3em] rounded-md text-sm text-center font-mono bg-P-box-inset')}>
          {count}
        </span>
      </div>
      <Button onClick={() => setCount((prev) => prev + 1)}>Increment Counter</Button>
    </div>
  )
}
