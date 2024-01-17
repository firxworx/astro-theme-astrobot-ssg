import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@helpers/style'
import { Link } from '../Link'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  prevUrl: string | undefined
  nextUrl: string | undefined
  className?: string
}

export function Pagination({
  className,
  currentPage,
  totalPages,
  prevUrl,
  nextUrl,
}: PaginationProps): JSX.Element | null {
  if (totalPages <= 1) {
    return null
  }

  const isPrevEnabled = currentPage > 1 && !!prevUrl
  const isNextEnabled = currentPage < totalPages && !!nextUrl

  return (
    <nav className={cn('flex justify-center items-center', className)} aria-label="Pagination">
      <Link
        href={prevUrl ?? '#'}
        className="mr-4 inline-flex select-none items-center"
        disabled={isPrevEnabled ? undefined : true}
        aria-label="Previous"
      >
        <ChevronLeftIcon className="h-5 w-5" />
        <span>Prev</span>
      </Link>
      <span className="text-sm opacity-75">
        {currentPage} / {totalPages}
      </span>
      <Link
        href={nextUrl ?? '#'}
        className="ml-4 inline-flex select-none items-center"
        disabled={isNextEnabled ? undefined : true}
        aria-label="Next"
      >
        <span>Next</span>
        <ChevronRightIcon className="h-5 w-5" />
      </Link>
    </nav>
  )
}
