/**
 * Decodes a raw location.pathname the same way react-router (6.14+) decodes
 * match.pathname: per segment, keeping "/" inside params encoded as %2F, and
 * returning the raw pathname untouched if any segment is malformed (see
 * decodePath in @remix-run/router).
 */
export const decodeRouterPath = (pathname: string) => {
  try {
    return pathname
      .split('/')
      .map((segment) => decodeURIComponent(segment).replace(/\//g, '%2F'))
      .join('/')
  } catch {
    return pathname
  }
}
