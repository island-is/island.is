/**
 * Guards against the source system returning the same row more than once in
 * a single response (e.g. an unstable sort across pages) — keeps the first
 * occurrence of each id, dropping the rest.
 */
export const dedupeById = <T>(
  items: T[],
  getId: (item: T) => string | number,
): T[] => {
  const seen = new Set<string | number>()
  return items.filter((item) => {
    const id = getId(item)
    if (seen.has(id)) {
      return false
    }
    seen.add(id)
    return true
  })
}
