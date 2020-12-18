import {
  NationalRegistryUser,
  NationalRegistryFamilyMember,
  Gender,
  MaritalStatus,
  BanMarking,
} from '../../types'
import { factory, faker } from '@island.is/shared/mocking'

export const banMarking = factory<BanMarking>({
  startDate: () => faker.date.past().toString(),
  banMarked: () => faker.random.boolean(),
})

export const getMinorGender = () => {
  const genderArr: Gender[] = [
    'FEMALE_MINOR',
    'MALE_MINOR',
    'TRANSGENDER_MINOR',
  ]
  return faker.random.arrayElement(genderArr)
}

export const getGender = () => {
  const genderArr: Gender[] = ['FEMALE', 'MALE', 'TRANSGENDER']
  return faker.random.arrayElement(genderArr)
}

export const getMaritalStatus = () => {
  const genderArr: MaritalStatus[] = [
    'DIVORCED',
    'SEPARATED',
    'MARRIED',
    'UNMARRIED',
  ]
  return faker.random.arrayElement(genderArr)
}

export const address = `${faker.address.streetName().toString()}
  ${faker.random.number(200)},
  ${faker.address.zipCode()}
  ${faker.address.city()}`

export const registryUser = factory<NationalRegistryUser>({
  nationalId: '1231231234',
  fullName: 'Tester Testerson',
  gender: getGender(),
  legalResidence: () => address,
  birthPlace: () => faker.address.city().toString(),
  citizenship: () => faker.address.countryCode().toString(),
  religion: () => faker.lorem.sentence(3).toString(),
  maritalStatus: getMaritalStatus(),
  banMarking: banMarking(),
})

export const spouse = factory<NationalRegistryFamilyMember>({
  nationalId: () => faker.random.alphaNumeric(10),
  fullName: () => faker.name.findName(),
  gender: getGender(),
  maritalStatus: 'MARRIED',
  address: address,
  familyRelation: 'spouse',
})

export const child = factory<NationalRegistryFamilyMember>({
  nationalId: () => faker.random.alphaNumeric(10),
  fullName: () => faker.name.findName(),
  gender: getMinorGender(),
  maritalStatus: 'UNMARRIED',
  address: address,
  familyRelation: 'child',
})
