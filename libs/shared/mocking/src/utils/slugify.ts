import faker from 'faker'

/**
 * Factory helper which slugs another field on the factory.
 */
export const slugify = <T, K extends keyof T>(
  fieldName: K,
): ((this: T) => string) => {
  return function () {
    const value = this[fieldName]
    if (typeof value !== 'string') {
      throw new Error(
        `Could not slugify field ${String(fieldName)}. Wasn't string.`,
      )
    }
    return faker.helpers.slugify(value).toLowerCase()
  }
}
