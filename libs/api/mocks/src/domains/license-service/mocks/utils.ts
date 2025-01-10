import { faker } from '@faker-js/faker'
import { GenericLicenseDataField } from '../../../types'

export const maybeExpired = () =>
  faker.datatype.boolean()
    ? faker.date.past().toISOString()
    : faker.date.future().toISOString()

// Specific licenses require custom mocks. The Factory function doesn't seem to like
// creating an array of genericDataFields so we just make our own loop function >:(
// The shared factory.list() function keeps returning the same faker values.
// This one doesn't.

export const generateDataField = (
  factory: () => () => GenericLicenseDataField,
  count: number,
) => {
  return faker.helpers.multiple(() => factory(), { count })
}
