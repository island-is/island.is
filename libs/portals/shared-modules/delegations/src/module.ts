import { delegationScopes } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { Features } from '@island.is/feature-flags'

import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { DelegationPaths } from './lib/paths'

export const delegationsModule: PortalModule = {
  name: 'Aðgangsstýring',
  featureFlag: Features.outgoingDelegationsV2,
  widgets: () => [],
  routes({ userInfo }) {
    const hasAccess = delegationScopes.some((scope) =>
      userInfo.scopes.includes(scope),
    )
    const accessControlCommonFields = {
      name: m.accessControlDelegations,
      path: DelegationPaths.Delegations,
      navHide: !hasAccess,
      enabled: hasAccess,
      render: () => lazy(() => import('./screens/AccessControl')),
    }

    const routes: PortalRoute[] = [
      {
        ...accessControlCommonFields,
        path: DelegationPaths.Delegations,
      },
      {
        ...accessControlCommonFields,
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
