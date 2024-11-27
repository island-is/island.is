import { faker } from '@faker-js/faker'

/**
 * Creates an array of unique words
 * @param size The size of the words array
 */
export const createUniqueWords = (size: number): string[] => {
  return faker.helpers.uniqueArray(() => faker.word.sample(), size);
}
