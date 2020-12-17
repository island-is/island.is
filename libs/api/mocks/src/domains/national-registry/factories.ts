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

export const address = `${faker.address.streetName().toString()}
  ${faker.random.number(200)},
  ${faker.address.zipCode()}
  ${faker.address.city()}`

export const registryUser = factory<NationalRegistryUser>({
  nationalId: '1231231234',
  fullName: 'Tester Testerson',
  gender: 'MALE',
  legalResidence: () => address,
  birthPlace: () => faker.address.city().toString(),
  citizenship: () => faker.address.countryCode().toString(),
  religion: () => faker.lorem.sentence(3).toString(),
  maritalStatus: 'MARRIED',
  banMarking: banMarking(),
})

export const familyMember = factory<NationalRegistryFamilyMember>({
  nationalId: () => faker.random.alphaNumeric(10),
  fullName: () => faker.name.findName(),
  gender: 'FEMALE',
  maritalStatus: 'MARRIED',
  address: address,
  familyRelation: 'spouse',
})
