export const getSlugPart = (s = '', part: number): string => {
  if (part <= 0) {
    return ''
  }

  const i = part - 1

  return s
    .replace(/^\/|\/$/g, '')
    .replace(/([^:]\/)\/+/g, '$1')
    .split('/')
    .reduce((sum, cur, index) => {
      if (index === i) {
        return cur
      }

      return sum
    }, '')
}
