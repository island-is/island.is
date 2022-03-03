import * as faker from 'faker'

export const createNationalId = (): string => {
  return faker.datatype
    .number({
      min: 10000000000,
      max: 9999999999,
    })
    .toString()
}
