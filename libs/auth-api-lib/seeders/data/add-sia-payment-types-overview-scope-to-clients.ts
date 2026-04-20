import { addScopesToClient, compose } from './helpers'

export const up = compose(
  addScopesToClient({
    clientId: '@island.is/clients/api',
    scopeNames: [
      '@tr.is/yfirlitgreidslutegunda:read',
      '@tr.is/personuafslattur:read',
      '@tr.is/personuafslattur:write',
    ],
  }),
)
