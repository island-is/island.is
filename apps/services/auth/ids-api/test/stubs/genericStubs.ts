import { createNationalId } from '@island.is/testing/fixtures'
import { faker } from '@faker-js/faker'

export type NameIdTuple = [name: string, id: string]

export const getFakeNationalId = () => faker.string.numeric(10)

export const getFakeCompanyNationalId = () => createNationalId('company')

export const getFakeName = () =>
  faker.helpers.fake('{{name.firstName}} {{name.lastName}}')

export const getFakePerson = (): NameIdTuple => [
  getFakeName(),
  createNationalId('person'),
]

export default {
  getFakeNationalId,
  getFakeName,
  getFakePerson,
  getFakeCompanyNationalId,
}
