import { URL } from 'url'

/**
 * Validates the URI against allowed URIs to block external URLs.
 *
 * Security Considerations:
 * - Subdomain Attacks: Prevents bypassing validation via subdomains (e.g., `evil.example.com`).
 * - Path Traversal: Prevents accessing unintended paths, e.g. https://island.is.evil.is/some-path could pass validation if https://island.is is the allowed URL when using startWith() for example.
 * - Protocol Hijacking: Ensures the protocol (e.g., `https`) matches exactly.
 *
 * This function compares both the protocol, hostname, and optionally, the pathname.
 *
 * @param uri - The URI to validate.
 * @param allowedUris - List of allowed URIs.
 * @returns True if the URI is valid, false otherwise.
 */
export const validateUri = (uri: string, allowedUris: string[]): boolean => {
  try {
    const parsedUri = new URL(uri)

    return allowedUris.some((allowedUri) => {
      const parsedAllowedUri = new URL(allowedUri)
      const isSameProtocol = parsedUri.protocol === parsedAllowedUri.protocol
      const isSameHostname = parsedUri.hostname === parsedAllowedUri.hostname
      const isSamePathname =
        parsedUri.pathname === parsedAllowedUri.pathname ||
        parsedUri.pathname.startsWith(parsedAllowedUri.pathname)

      return isSameProtocol && isSameHostname && isSamePathname
    })
  } catch {
    return false
  }
}
