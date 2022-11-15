import faker from 'faker'
import { GenericLicenseDataField } from '../../../types'

export const maybeExpired = () =>
  faker.datatype.boolean()
    ? faker.date.past().toISOString()
    : faker.date.future().toISOString()

// The factory function returns the same faker seeds if supplied.
// However, if the function the creates the factory is supplied,
// we get a different seed!
// This looks dumb tho

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
