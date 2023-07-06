/** Make sure that links are relative in case someone links to production directly */
export const getRelativeUrl = (url: string) =>
  new URL(url.trim(), 'https://island.is').pathname
