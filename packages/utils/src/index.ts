// Date utilities
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Function utilities
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Cookie utilities
export * from './cookie'

// Axios utilities
export { default as request } from './axios/index'
export * from './axios/types'
