import { AuthScope } from '@island.is/auth/scopes'
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
    const hasAccess = userInfo.scopes.includes(AuthScope.delegations)
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
        render: () => lazy(() => import('./screens/AccessOutgoing')),
      },
    ]

    return routes
  },
}
