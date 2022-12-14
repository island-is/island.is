/**
 * @param {T} err Error object
 * @return {boolean} True iff a document was removed
 * Filter the HUMONGOUS documents in an error object
 */
export function filterDoc<T>(node: T, visited = new Set()): boolean {
  if (visited.has(node) || !node) return false

  // Only add objects to the visited set
  visited.add(node)

  let deleted = false
  if (Object.keys(node).length == 0) return false
  for (const key in node) {
    const value = node[key]
    // Only HUMONGOUS documents should reach this limit
    if (typeof value == 'string' && value.length > 10000) {
      delete node[key]
      deleted = true
    }
    return filterDoc(node[key], visited)
  }
  return deleted
}
