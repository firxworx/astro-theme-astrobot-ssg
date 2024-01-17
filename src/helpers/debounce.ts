/**
 * Debounce a given function by a given duration in milliseconds.
 */
export function debounce<F extends (...args: unknown[]) => void>(
  func: F,
  waitMs: number,
): (...args: Parameters<F>) => void {
  let timeoutId: number | null = null

  return function (...args: Parameters<F>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = window.setTimeout(() => func(...args), waitMs)
  }
}
