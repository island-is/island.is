import { factory, faker } from '@island.is/shared/mocking'
import { createNationalId } from '@island.is/testing/fixtures'
import { Identity, IdentityAddress } from '../../types'

export const identityAddress = factory<IdentityAddress>({
  streetAddress: faker.address.streetAddress(),
  postalCode: faker.address.zipCode(),
  city: faker.address.city(),
})

export const identity = factory<Identity>({
  nationalId: () => createNationalId('person'),
  name: () => faker.name.findName(),
  type: 'Person',
  address: () => identityAddress(),

  $traits: {
    company: {
      type: 'Company',
      name: () => faker.company.companyName(),
      nationalId: () => createNationalId('company'),
    },
  },
})
