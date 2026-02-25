export const push = (args: unknown[], retries = 10, delay = 50): void => {
  if (typeof window === 'undefined' || !window._paq) {
    return
  }
  const attempt = (remaining: number) => {
    if (window._paq && typeof window._paq.push === 'function') {
      window._paq.push(args)
      return
    }

    if (remaining <= 0) return

    setTimeout(() => attempt(remaining - 1), delay)
  }

  attempt(retries)
}
