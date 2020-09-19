import flatten from 'lodash/flatten'

export const createTerms = (termStrings: string[]): string[] => {
  const singleWords = termStrings.map((termString = '') => {
    const words = termString
      .toLowerCase()
      .replace(/[^a-záðéíóúýþæö]+/g, ' ') // remove all non characters
      .split(/\s+/)
    return words
  })
  return flatten(singleWords).filter((word) => word.length > 1) // fitler out 1 letter words and empty string
}

export const extractStringsFromObject = (contentObject) => {
  return Object.values(contentObject).reduce((contentString, content) => {
    if (typeof content === 'object') {
      // lets extract string from nested objects
      return contentString + extractStringsFromObject(content)
    } else if(typeof content === 'string') {
      try {
        const parsedContent = JSON.parse(content)
        return contentString + extractStringsFromObject(parsedContent)
      } catch (e) {
        return `${contentString} ${content}`
      }
    } else {
      return contentString
    }
  }, '')
}
