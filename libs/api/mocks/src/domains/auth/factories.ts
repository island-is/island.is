import addYears from 'date-fns/addYears'
import { factory, faker, title } from '@island.is/shared/mocking'
import { createNationalId } from '@island.is/testing/fixtures'
import {
  AuthCustomDelegation,
  AuthDelegation,
  AuthApiScope,
  AuthDomain,
  AuthDelegationScope,
} from '../../types'

export const domain = factory<AuthDomain>({
  name: () => `@${faker.internet.domainName()}`,
  description: () => faker.lorem.paragraph(),
  nationalId: () => createNationalId('company'),
  displayName: () => faker.company.name(),
  organisationLogoKey: ({ displayName }) => displayName,
  organisationLogoUrl: () =>
    faker.image.urlLoremFlickr({ category: 'business', height: 16, width: 16 }),
})

export const apiScope = factory<AuthApiScope>({
  displayName: () => title(),
  description: () => faker.lorem.paragraph(),
  name: () => `@${faker.internet.domainName()}/${faker.lorem.slug()}`,
})

export const delegationScope = factory<AuthDelegationScope>({
  id: () => faker.string.uuid(),
  apiScope: () => apiScope(),
  displayName: ({ apiScope }) => apiScope!.displayName,
  name: ({ apiScope }) => apiScope!.name,
})

export const customDelegation = factory<AuthCustomDelegation>({
  id: () => faker.string.uuid(),
  from: () => ({
    nationalId: createNationalId('person'),
    name: faker.person.fullName(),
    type: 'Person',
  }),
  domain: () => domain(),
  to: () => ({
    nationalId: createNationalId('person'),
    name: faker.person.fullName(),
    type: 'Person',
  }),
  createdBy: () => ({
    nationalId: createNationalId('person'),
    name: faker.person.fullName(),
    type: 'Person',
  }),
  type: 'Custom',
  provider: 'delegationdb',
  scopes: () => delegationScope.list(5),
  validTo: () => addYears(new Date(), 1).toISOString(),
  __typename: 'AuthCustomDelegation',
})
