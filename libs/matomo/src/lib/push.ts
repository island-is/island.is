export const push = (args: unknown[]): void => {
  if (typeof window === 'undefined' || !window._paq) {
    return
  }
  window._paq.push(args)
}
