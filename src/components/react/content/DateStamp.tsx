import { CalendarIcon } from 'lucide-react'
import { SITE } from '@config'
import { cn } from '@helpers/style'
import type { ContentDateMeta } from '@/types/content.types'

export interface DateStampProps extends ContentDateMeta {
  size?: 'sm' | 'md'
  className?: string
  hasTime?: boolean
  hasIcon?: boolean
}

export interface DisplayLocaleDateTimeProps extends ContentDateMeta, Pick<DateStampProps, 'hasTime'> {
  dateFormat?: 'locale' | 'iso'
}

/**
 * Date/time display stamp for dated content such as blog posts.
 */
export function DateStamp({
  publishedAt,
  modifiedAt,
  size = 'sm',
  hasIcon = true,
  hasTime = false,
  className,
}: DateStampProps): JSX.Element {
  return (
    <div className={cn('flex items-center gap-2 leading-none', className)}>
      {hasIcon && (
        <CalendarIcon
          className={cn({
            'h-4 w-4': size === 'sm',
            'h-5 w-5': size === 'md',
          })}
          aria-hidden="true"
        />
      )}
      <span className="sr-only">{modifiedAt ? 'Updated:' : 'Published:'}</span>
      <span
        className={cn({
          'text-sm': size === 'sm',
          'text-base': size === 'md',
        })}
      >
        <DisplayLocaleDateTime publishedAt={publishedAt} modifiedAt={modifiedAt} hasTime={hasTime} />
      </span>
      {!!modifiedAt && (
        <span
          className={cn('inline-block uppercase tracking-wide pl-0.5 opacity-90', {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
          })}
          aria-hidden="true"
        >
          Updated
        </span>
      )}
    </div>
  )
}

const DisplayLocaleDateTime = ({
  publishedAt,
  modifiedAt,
  hasTime = false,
  dateFormat = 'iso',
}: DisplayLocaleDateTimeProps): JSX.Element => {
  const dt = new Date(modifiedAt ? modifiedAt : publishedAt)

  const date =
    dateFormat === 'iso'
      ? dt.toISOString().split('T')[0]
      : dt.toLocaleDateString(SITE.locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })

  const time = dt.toLocaleTimeString(SITE.locale, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      <time dateTime={dt.toISOString()}>{date}</time>
      {hasTime && (
        <>
          <span>&nbsp;at&nbsp;</span>
          <span className="text-nowrap">{time}</span>
        </>
      )}
    </>
  )
}
