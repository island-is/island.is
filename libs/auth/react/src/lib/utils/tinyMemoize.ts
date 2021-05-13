/**
 * Makes sure there's only one call to an async function active at any time.
 */
export const tinyMemoize = <T>(asyncFunction: () => Promise<T>) => {
  let lastPromise: Promise<T> | null
  return () => {
    if (!lastPromise) {
      lastPromise = asyncFunction()
      lastPromise.finally(() => {
        lastPromise = null
      })
      return lastPromise
    }

    return lastPromise
  }
}
