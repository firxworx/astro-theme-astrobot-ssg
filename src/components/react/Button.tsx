import { cn } from '@helpers/style'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

const buttonBaseClassName = cn(
  'inline-flex items-center justify-center px-3 py-2 border rounded-md transition-colors',
  'text-sm font-medium',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'cx-focus', // custom focus class (@see tailwind preset)
)

const primaryVariantClassName = cn(
  buttonBaseClassName,
  'bg-P-primary hover:bg-P-primary-hover text-P-primary-fg border-transparent',
)

const ghostVariantClassName = cn(
  buttonBaseClassName,
  'bg-transparent hover:bg-neutral-100 text-neutral-700 border-neutral-300',
)

export function Button({ type = 'button', variant = 'primary', children, ...restProps }: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={cn({
        [primaryVariantClassName]: variant === 'primary',
        [ghostVariantClassName]: variant === 'ghost',
      })}
      {...restProps}
    >
      {children}
    </button>
  )
}
