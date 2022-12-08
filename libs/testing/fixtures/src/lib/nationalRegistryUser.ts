import * as faker from 'faker'

import { NationalRegistryClientPerson } from '@island.is/shared/types'

import { createNationalId } from './nationalId'

const createRandomNationalRegistryUser = (): NationalRegistryClientPerson => {
  const [givenName, middleName, familyName] = [
    faker.name.firstName(),
    faker.name.middleName(),
    faker.name.lastName(),
  ]
  const name = `${givenName} ${middleName} ${familyName}`

  return {
    nationalId: createNationalId('person'),
    name,
    givenName,
    middleName,
    familyName,
    fullName: name,
    genderCode: faker.datatype.number({ min: 1, max: 8 }).toString(),
    exceptionFromDirectMarketing: faker.datatype.boolean(),
    birthdate: faker.date.past(100),
    legalDomicile: {
      streetAddress: faker.address.streetName(),
      postalCode: faker.address.zipCode(),
      locality: faker.address.city(),
      municipalityNumber: faker.address.cityPrefix(),
    },
    residence: {
      streetAddress: faker.address.streetName(),
      postalCode: faker.address.zipCode(),
      locality: faker.address.city(),
      municipalityNumber: faker.address.cityPrefix(),
    },
  }
}

export const createNationalRegistryUser = (
  user: Partial<NationalRegistryClientPerson> = createRandomNationalRegistryUser(),
): NationalRegistryClientPerson => {
  const fallback = createRandomNationalRegistryUser()

  const {
    nationalId = user['nationalId'] ?? fallback['nationalId'],
    name = user['name'] ?? fallback['name'],
    givenName = user['givenName'] ?? fallback['givenName'],
    middleName = user['middleName'] ?? fallback['middleName'],
    familyName = user['familyName'] ?? fallback['familyName'],
    fullName = user['fullName'] ?? fallback['fullName'],
    genderCode = user['genderCode'] ?? fallback['genderCode'],
    exceptionFromDirectMarketing = user['exceptionFromDirectMarketing'] ??
      fallback['exceptionFromDirectMarketing'],
    birthdate = user['birthdate'] ?? fallback['birthdate'],
    legalDomicile = user['legalDomicile'] ?? fallback['legalDomicile'],
    residence = user['residence'] ?? fallback['residence'],
  } = user

  return {
    nationalId,
    name,
    givenName,
    middleName,
    familyName,
    fullName,
    genderCode,
    exceptionFromDirectMarketing,
    birthdate,
    legalDomicile,
    residence,
  }
}
