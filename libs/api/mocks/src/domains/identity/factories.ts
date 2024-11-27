import { factory, faker } from '@island.is/shared/mocking'
import { createNationalId } from '@island.is/testing/fixtures'
import { Identity, IdentityAddress } from '../../types'

export const identityAddress = factory<IdentityAddress>({
  streetAddress: faker.location.streetAddress(),
  postalCode: faker.location.zipCode(),
  city: faker.location.city(),
})

export const identity = factory<Identity>({
  nationalId: () => createNationalId('person'),
  name: () => faker.person.fullName(),
  type: 'Person',
  address: () => identityAddress(),

  $traits: {
    company: {
      type: 'Company',
      name: () => faker.company.name(),
      nationalId: () => createNationalId('company'),
    },
  },
})
