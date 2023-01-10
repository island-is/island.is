import { delegationScopes } from '@island.is/auth/scopes'
import { lazy } from 'react'

import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { DelegationPaths } from './lib/paths'
import { m } from './lib/messages'

export const delegationsModule: PortalModule = {
  name: m.accessControl,
  enabled({ userInfo }) {
    return delegationScopes.some((scope) => userInfo.scopes.includes(scope))
  },
  routes({ userInfo }) {
    const hasAccess = delegationScopes.some((scope) =>
      userInfo.scopes.includes(scope),
    )
    const commonProps = {
      name: m.accessControlDelegations,
      path: DelegationPaths.Delegations,
      navHide: !hasAccess,
      render: () => lazy(() => import('./screens/AccessControl')),
    }

    const routes: PortalRoute[] = [
      {
        ...commonProps,
        path: DelegationPaths.Delegations,
      },
      {
        ...commonProps,
        path: DelegationPaths.DelegationsIncoming,
      },
      {
        name: m.accessControlGrant,
        path: DelegationPaths.DelegationsGrant,
        render: () => lazy(() => import('./screens/GrantAccess/GrantAccess')),
      },
      {
        name: m.accessControlAccess,
        path: DelegationPaths.DelegationAccess,
        render: () =>
          lazy(() => import('./screens/AccessOutgoing/AccessOutgoing')),
      },
    ]

    return routes
  },
}
