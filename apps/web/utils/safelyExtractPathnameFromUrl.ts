// Use fallback domain in case url is relative since we just want the pathname
const FALLBACK_DOMAIN = 'https://island.is'

const JSON_ENDING = '.json'

export const safelyExtractPathnameFromUrl = (url?: string) => {
  if (!url) return ''

  let pathname = new URL(url, FALLBACK_DOMAIN).pathname

  if (pathname.endsWith(JSON_ENDING)) {
    pathname = pathname.slice(0, pathname.indexOf(JSON_ENDING))
  }

  // Handle client side getServerSideProps calls
  if (pathname.startsWith('/_next/data')) {
    // The pathname looks like this then: '/_next/data/${bundleId}/...'

    // We split it to get: ['', '_next', 'data', `${bundleId}`, ...]
    const sections = pathname.split('/')

    // Then join the sections back together only keeping what makes up the url
    pathname = `/${sections.slice(4).join('/')}`
  }

  return pathname
}
