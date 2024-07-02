import { compose, createClient, createScope } from './helpers'

export const up = compose(
  createClient({
    clientId: '@island.is/test-seed-for-client',
    clientType: 'machine',
    displayName: 'Testing',
    description: 'Testing seed script for client and delegation types',
    supportDelegations: true,
  }),
  createScope({
    name: '@island.is/test-seed-for-scope',
    displayName: 'Testing',
    description: 'Testing seed script for api scope and delegation types',
    delegation: {
      legalGuardians: true,
      procuringHolders: true,
      custom: true,
    },
  }),
)
