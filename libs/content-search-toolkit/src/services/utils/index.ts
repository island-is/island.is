/**
 * @param node The node to filter
 * @param visited A set of nodes already visited
 * @param letterLimit The max number of letters allowed
 * @return True iff. a document was removed
 *
 * Filter the HUMONGOUS documents in an error object
 */
export const filterDoc = function filterDoc<T extends object>(
  node: T,
  visited: Set<T> = new Set(),
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
      filterDoc(value as T, visited, letterLimit)
    ) {
      deleted = true
    }
  }
  return deleted
}

export const getValidBulkRequestChunk = function getValidBulkRequestChunk(
  requests: Record<string, unknown>[],
  maxSize = 20,
) {
  let count = 0
  for (let i = requests.length - 1; i >= 0; i -= 1) {
    let increment = 0

    const requestTakesUpASingleLine = 'delete' in requests[i]

    if (requestTakesUpASingleLine) {
      increment = 1
    } else {
      increment = 2
      i -= 1 // Skip the next request since that's the operation for this request
    }

    const wouldGoOverMaxSize = count + increment > maxSize
    if (wouldGoOverMaxSize) break

    count += increment
  }
  return requests.splice(-count, count)
}
