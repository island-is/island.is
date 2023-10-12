import faker from 'faker'

/**
 * Creates an array of unique words
 * @param size The size of the words array
 */
export const createUniqueWords = (size: number): string[] => {
  const randomWords = [...Array(size)].map(() => faker.random.word())

  if (new Set(randomWords).size !== randomWords.length) {
    return createUniqueWords(size)
  }

  return randomWords
}
