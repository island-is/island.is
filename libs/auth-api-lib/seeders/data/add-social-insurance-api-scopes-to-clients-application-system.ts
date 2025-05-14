import { addScopesToClient, compose } from './helpers'

export const up = compose(
  addScopesToClient({
    clientId: '@island.is/clients/application-system',
    scopeNames: [
      '@tr.is/umsoknir:write',
      '@tr.is/umsoknir:read',
      '@tr.is/umsaekjandi:read',
      '@tr.is/almennt:read',
      '@tr.is/fylgiskjol:write',
      '@tr.is/tekjuaetlun:read',
      '@tr.is/greidsluaetlun:read',
      '@tr.is/stadgreidsla:read',
      '@tr.is/sjukraogendurhaefingargreidslur:read',
    ],
  }),
)
