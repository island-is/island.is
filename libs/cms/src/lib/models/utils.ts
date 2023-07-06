const prefix = 'https://island.is'

/** Make sure that links are relative in case someone links to production directly */
export const getRelativeUrl = (url: string) => {
  const trimmedUrl = url.trim()

  if (trimmedUrl.startsWith(prefix)) {
    if (trimmedUrl.length === prefix.length) {
      return '/'
    }
    return trimmedUrl.slice(prefix.length)
  }

  return trimmedUrl
}
