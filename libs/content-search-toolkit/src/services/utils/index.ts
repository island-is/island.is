/**
 * @param {T} err Error object
 * @return {boolean} True iff a document was removed
 * Filter the HUMONGOUS documents in an error object
 */
export function filterDoc<T>(o: T, visited = new Set()): boolean {
  if (visited.has(o) || !o) return false

  // Only add objects to the visited set
  visited.add(o)

  let deleted = false
  if (Object.keys(o).length == 0) return false
  for (const key in o) {
    const value = o[key]
    // Only HUMONGOUS documents should reach this limit
    if (typeof value == 'string' && value.length > 10000) {
      delete o[key]
      deleted = true
    }
    return filterDoc(o[key], visited)
  }
  return deleted
}
