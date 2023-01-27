/**
 * @param {T} err Error object
 * @return {boolean} True iff a document was removed
 *
 * Filter the HUMONGOUS documents in an error object
 */
export function filterDoc<T>(
  node: T,
  visited = new Set(),
  letterLimit = 10000,
): boolean {
  if (visited.has(node) || !node) return false

  visited.add(node)

  let deleted = false
  if (Object.keys(node).length == 0) return false
  for (const key in node) {
    const value = node[key]
    // Only HUMONGOUS documents should reach this limit
    if (typeof value === 'string' && value.length > letterLimit) {
      delete node[key]
      deleted = true
      continue
    } else if (
      typeof value === 'object' &&
      filterDoc(value, visited, letterLimit)
    ) {
      deleted = true
    }
  }
  return deleted
}

export function getValidBulkRequestChunk(
  requests: Record<string, unknown>[],
  maxSize = 20,
) {
  let count = 0
  for (let i = requests.length - 1; i >= 0; i -= 1) {
    const increment = 'delete' in requests[i] ? 1 : 2
    if (count + increment > maxSize) break
    count += increment
  }
  return requests.splice(-count, count)
}
