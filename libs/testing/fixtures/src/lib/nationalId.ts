import * as faker from 'faker'
import { generateCompany, generatePerson } from 'kennitala'

export type NationalIdType =
  | 'any'
  | 'company'
  | 'person'
  | 'resident'
  | 'residentAdult'
  | 'residentChild'
  | 'temporaryResident'

const YEAR = 1000 * 60 * 60 * 24 * 365

export const createNationalId = (type?: NationalIdType): string => {
  let date: Date
  let variant: number
  switch (type) {
    case 'company':
      date = new Date(Date.now() - faker.datatype.number(100 * YEAR))
      return generateCompany(date)
    case 'person':
      variant = faker.datatype.number(8)
      return variant === 0
        ? createNationalId('temporaryResident')
        : createNationalId('resident')
    case 'resident':
      variant = faker.datatype.number(4)
      return variant === 0
        ? createNationalId('residentChild')
        : createNationalId('residentAdult')
    case 'residentAdult':
      date = new Date(
        Date.now() - faker.datatype.number({ min: 18 * YEAR, max: 100 * YEAR }),
      )
      return generatePerson(date)
    case 'residentChild':
      date = new Date(Date.now() - faker.datatype.number(18 * YEAR))
      return generatePerson(date)
    case 'temporaryResident':
      return faker.helpers.replaceSymbolWithNumber(
        faker.helpers.regexpStyleStringParse('[8-9]#########'),
      )
    default:
      variant = faker.datatype.number(4)
      return variant === 0
        ? createNationalId('company')
        : createNationalId('person')
  }
}
