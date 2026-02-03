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
  displayName: () => faker.company.companyName(),
  organisationLogoKey: ({ displayName }) => displayName,
  organisationLogoUrl: () => faker.image.business(16, 16),
})

export const apiScope = factory<AuthApiScope>({
  displayName: () => title(),
  description: () => faker.lorem.paragraph(),
  name: () => `@${faker.internet.domainName()}/${faker.lorem.slug()}`,
})

export const delegationScope = factory<AuthDelegationScope>({
  id: () => faker.datatype.uuid(),
  apiScope: () => apiScope(),
  domain: () => domain(),
  displayName: ({ apiScope }) => apiScope!.displayName,
  name: ({ apiScope }) => apiScope!.name,
})

export const customDelegation = factory<AuthCustomDelegation>({
  id: () => faker.datatype.uuid(),
  from: () => ({
    nationalId: createNationalId('person'),
    name: faker.name.findName(),
    type: 'Person',
  }),
  domain: () => domain(),
  to: () => ({
    nationalId: createNationalId('person'),
    name: faker.name.findName(),
    type: 'Person',
  }),
  createdBy: () => ({
    nationalId: createNationalId('person'),
    name: faker.name.findName(),
    type: 'Person',
  }),
  type: 'Custom',
  provider: 'delegationdb',
  scopes: () => delegationScope.list(5),
  validTo: () => addYears(new Date(), 1).toISOString(),
  __typename: 'AuthCustomDelegation',
})
