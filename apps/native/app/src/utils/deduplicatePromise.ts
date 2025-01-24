export const deduplicatePromise = <T, Args extends unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>,
): ((...args: Args) => Promise<T>) => {
  let currentPromise: Promise<T> | null = null

  return async function (...args: Args): Promise<T> {
    if (!currentPromise) {
      currentPromise = asyncFunction(...args).finally(() => {
        currentPromise = null
      })
    }
    return currentPromise
  }
}
