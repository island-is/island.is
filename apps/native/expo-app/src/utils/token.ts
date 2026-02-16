const urlSafeBase64 = /^[A-Z0-9_-]*$/i

export const isBase64 = (str: string) => urlSafeBase64.test(str)

/**
 * Check if a string is a valid JWT token
 */
export const isJWT = (str: string) => {
  const dotSplit = str.split('.')
  const len = dotSplit.length

  if (len !== 3) {
    return false
  }

  return dotSplit.reduce((acc, currElem) => acc && isBase64(currElem), true)
}
