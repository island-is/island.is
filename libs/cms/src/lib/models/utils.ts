/** Make sure that links are relative in case someone links to production directly */
export const getRelativeUrl = (url: string) => {
  const urlObject = new URL(url.trim(), 'https://island.is')

  if (urlObject.host === 'island.is') {
    return urlObject.pathname
  }

  return urlObject.href
}
