import { faker } from '@faker-js/faker'
import { generateCompany, generatePerson } from 'kennitala'

export type NationalIdType =
  | 'any'
  | 'company'
  | 'person'
  | 'resident'
  | 'residentAdult'
  | 'residentChild'
  | 'temporaryResident'

export const createNationalId = (type?: NationalIdType): string => {
  let date: Date
  switch (type) {
    case 'company':
      date = faker.date.past({ years: 100 })
      return generateCompany(date)
    case 'person':
      return faker.datatype.boolean(0.1111)
        ? createNationalId('temporaryResident')
        : createNationalId('resident')
    case 'resident':
      return faker.datatype.boolean(0.2)
        ? createNationalId('residentChild')
        : createNationalId('residentAdult')
    case 'residentAdult':
      date = faker.date.birthdate({ mode: 'age', min: 18, max: 100 })
      return generatePerson(date)
    case 'residentChild':
      date = faker.date.birthdate({ mode: 'age', min: 1, max: 17 })
      return generatePerson(date)
    case 'temporaryResident':
      return (
        faker.number.int({ min: 8, max: 9 }).toString() +
        faker.string.numeric(9)
      )
    default:
      return faker.datatype.boolean(0.2)
        ? createNationalId('company')
        : createNationalId('person')
  }
}
