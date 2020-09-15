import _ from 'lodash'

export const createTerms = (termStrings: string[]): string[] => {
  const singleWords = termStrings.map((termString = '') => {
    const words = termString
      .toLowerCase()
      .replace(/[^a-záðéíóúýþæö]+/g, ' ') // remove all non characters
      .split(/\s+/)
    return words
  })
  return _.flatten(singleWords).filter((word) => word.length > 1) // fitler out 1 letter words and empty string
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
export const getCircularReplacer = () => {
  const seen = new WeakSet()

  return (_key: unknown, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }

      seen.add(value)
    }

    return value
  }
}
