/**
 * Validates the URI against allowed URIs to ensure blocking of external URLs.
 */
export const validateUri = async (uri: string, allowedUris: string[]) => {
  // Convert wildcard patterns to regular expressions
  const regexPatterns = allowedUris.map((pattern) => {
    // Escape special regex characters and replace '*' with a regex pattern to match any characters
    const regexPattern = pattern
      // Escape special characters for regex
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      // Convert '*' to '.*' to match any characters
      .replace(/\\\*/g, '.*')

    // Create a regex from the pattern and ensure it matches the entire URL
    return new RegExp(`^${regexPattern}$`)
  })

  // Check if the URL matches any of the allowed patterns
  return regexPatterns.some((regex) => regex.test(uri))
}
