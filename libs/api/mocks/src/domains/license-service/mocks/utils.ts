import faker from 'faker'
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
  const values = []

  // Factory keeps returning the same faker values,
  // this generates different values at least
  for (let i = 0; i < count; i++) {
    const value = factory()()
    values.push(value)
  }
  return values
}
