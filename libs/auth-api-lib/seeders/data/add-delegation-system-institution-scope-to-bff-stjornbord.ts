import { addScopesToClient, compose } from './helpers'

export const up = compose(
  addScopesToClient({
    clientId: '@admin.island.is/bff-stjornbord',
    scopeNames: ['@admin.island.is/delegation-system:institution'],
  }),
)
