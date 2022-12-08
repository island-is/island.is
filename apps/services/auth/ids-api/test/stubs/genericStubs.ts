import { createNationalId } from '@island.is/testing/fixtures'
import faker from 'faker'

export type NameIdTuple = [name: string, id: string]

export const getFakeNationalId = () =>
  faker.helpers.replaceSymbolWithNumber('##########')

export const getFakeName = () =>
  faker.fake('{{name.firstName}} {{name.lastName}}')

export const getFakePerson = (): NameIdTuple => [
  getFakeName(),
  createNationalId('person'),
]

export default {
  getFakeNationalId,
  getFakeName,
  getFakePerson,
}
