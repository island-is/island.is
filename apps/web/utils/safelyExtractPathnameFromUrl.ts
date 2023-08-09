export const safelyExtractPathnameFromUrl = (url?: string) => {
  try {
    return new URL(url, 'https://island.is').pathname
  } catch {
    return url ?? ''
  }
}
