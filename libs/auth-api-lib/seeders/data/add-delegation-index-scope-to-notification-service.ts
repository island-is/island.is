import { addScopesToClient, compose } from './helpers'

export const up = compose(
  addScopesToClient({
    clientId: '@island.is/system/notifications',
    scopeNames: ['@island.is/auth/delegations/index:system'],
  }),
)
