import { AuthScope } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { Features } from '@island.is/feature-flags'

import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  m,
} from '@island.is/service-portal/core'

export const delegationsModule: ServicePortalModule = {
  name: 'Aðgangsstýring',
  featureFlag: Features.outgoingDelegationsV2,
  widgets: () => [],
  routes: ({ userInfo }) => {
    const hasAccess = userInfo.scopes.includes(AuthScope.delegations)
    const accessControlCommonFields = {
      name: m.accessControlDelegations,
      path: ServicePortalPath.AccessControlDelegations,
      navHide: !hasAccess,
      enabled: hasAccess,
      render: () => lazy(() => import('./screens/AccessControl')),
    }

    const routes: ServicePortalRoute[] = [
      {
        ...accessControlCommonFields,
        path: ServicePortalPath.AccessControlDelegations,
      },
      {
        ...accessControlCommonFields,
        path: ServicePortalPath.AccessControlDelegationsIncoming,
      },
      {
        name: m.accessControlGrant,
        path: ServicePortalPath.AccessControlDelegationsGrant,
        render: () => lazy(() => import('./screens/GrantAccess/GrantAccess')),
      },
      {
        name: m.accessControlAccess,
        path: ServicePortalPath.AccessControlDelegationAccess,
        render: () => lazy(() => import('./screens/AccessOutgoing')),
      },
    ]

    return routes
  },
}
