// Use fallback domain in case url is relative since we just want the pathname
const FALLBACK_DOMAIN = 'https://island.is'

const JSON_ENDING = '.json'

export const safelyExtractPathnameFromUrl = (url?: string) => {
  if (!url) return ''

  let pathname = new URL(url, FALLBACK_DOMAIN).pathname

  if (pathname.endsWith(JSON_ENDING)) {
    pathname = pathname.slice(0, pathname.indexOf(JSON_ENDING))
  }

  return pathname
}
