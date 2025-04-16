import { factory, faker } from '@island.is/shared/mocking'
import { NationalRegistryPerson, NationalRegistrySpouse } from '../../types'

const genders = ['MALE_MINOR', 'FEMALE_MINOR', 'TRANSGENDER_MINOR', 'UNKNOWN']

export const spouse = factory<NationalRegistrySpouse>({
  nationalId: () =>
    faker.random.number({ min: 1000000000, max: 9999999999 }).toString(),
  fullName: () => faker.name.findName(),
})
export const person = factory({
  nationalId: () =>
    faker.random.number({ min: 1000000000, max: 9999999999 }).toString(),
  fullName: () => faker.name.findName(),
})

export const childDetails = factory({
  gender: () => faker.random.arrayElement(genders),
  fullName: () => faker.name.findName(),
})

export const personWithChildrenAndSpouse = factory<NationalRegistryPerson>({
  nationalId: () =>
    faker.random.number({ min: 1000000000, max: 9999999999 }).toString(),
  fullName: () => faker.name.findName(),
  spouse: () => spouse(),
  biologicalChildren: () => [
    { ...person(), ...childDetails() },
    { ...person(), ...childDetails() },
  ],
  childCustody: () => [{ ...person(), ...childDetails() }],
})
