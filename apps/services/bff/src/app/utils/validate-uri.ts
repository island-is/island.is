/**
 * Validates the URI against allowed URIs to ensure blocking of external URLs.
 *
 * @param uri - The URI to validate.
 * @param allowedUris - An array of allowed URIs.
 * @returns True if the URI starts with any of the allowed URIs; otherwise, false.
 */
export const validateUri = (uri: string, allowedUris: string[]) => {
  return allowedUris.some((allowedUri) => uri.startsWith(allowedUri))
}
