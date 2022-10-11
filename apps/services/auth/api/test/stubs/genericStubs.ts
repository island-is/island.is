import faker from 'faker'

export type NameIdTuple = [name: string, id: string]

export const getFakeNationalId = () =>
  faker.helpers.replaceSymbolWithNumber('##########')

export const getFakeName = () =>
  faker.fake('{{name.firstName}} {{name.lastName}}')

export const getFakePerson = (): NameIdTuple => [
  getFakeName(),
  getFakeNationalId(),
]

export default {
  getFakeNationalId,
  getFakeName,
  getFakePerson,
}
