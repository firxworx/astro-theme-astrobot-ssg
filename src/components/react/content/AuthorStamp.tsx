import { SparklesIcon } from 'lucide-react'
import { cn } from '@helpers/style'

interface AuthorStampProps {
  author: string | undefined | null
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Author icon and name combo.
 * Designed to coordinate with the DateStamp component and work for content posts.
 *
 * Renders `null` if `author` is empty.
 */
export function AuthorStamp({ author, size = 'sm', className }: AuthorStampProps): JSX.Element | null {
  if (!author) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <SparklesIcon
        className={cn({
          'h-4 w-4': size === 'sm',
          'h-5 w-5': size === 'md',
        })}
        aria-hidden="true"
      />
      <span
        className={cn({
          'text-sm': size === 'sm',
          'text-base': size === 'md',
        })}
      >
        {author}
      </span>
    </div>
  )
}
