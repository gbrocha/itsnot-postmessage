export interface Cancelable {
  clear(): void
}

type GenericFn = (...args: unknown[]) => unknown

type DebounceReturn<T> = Cancelable & T

// Corresponds to 10 frames at 60 Hz.
// A few bytes payload overhead when lodash/debounce is ~3 kB and debounce ~300 B.
export default function debounce<T extends GenericFn>(
  func: T,
  wait = 166,
): DebounceReturn<T> {
  let timeout: NodeJS.Timeout

  const debounced = (...args) => {
    const later = () => {
      func.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }

  debounced.clear = () => clearTimeout(timeout)

  return debounced as DebounceReturn<T>
}
