/**
 * Remove trailing slash from a string
 *
 * @example
 * removeTrailingSlash('https://example.com/') // 'https://example.com'
 */
export const removeTrailingSlash = (str: string) => str.replace(/\/$/, '')
