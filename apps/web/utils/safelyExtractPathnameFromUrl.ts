export const safelyExtractPathnameFromUrl = (url?: string) => {
  try {
    return new URL(url).pathname
  } catch {
    return ''
  }
}
