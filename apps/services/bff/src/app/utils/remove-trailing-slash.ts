/**
 * Remove trailing slash from a string
 *
 * @example
 * removeTrailingSlash('https://example.com/') // 'https://example.com'
 */
export const removeTrailingSlash = (str: string) => {
  if (!str || str === '/') {
    return ''
  }

  return str.endsWith('/') ? str.slice(0, -1) : str
}
