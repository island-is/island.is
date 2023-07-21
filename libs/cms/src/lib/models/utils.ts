/** Make sure that links are relative in case someone links to production directly */
export const getRelativeUrl = (url: string) => {
  const urlObject = new URL(url.trim(), 'https://island.is')
  if (urlObject.host === 'island.is') {
    return urlObject.pathname
  }
  return urlObject.href
}

/** Some values from the sync api in Contentful can be faulty,
 *  an array could be returned as an object since that object might then contain locale keys which eventually give you the array in question but in case those locale keys are missing then you are just left with an empty object,
 *  which is why this function comes in handy */
export const getArrayOrEmptyArrayFallback = <T>(
  input: T[] | null | undefined,
): T[] => {
  if (!input?.length) return []
  return input
}
