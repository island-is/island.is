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
    const isCompany = userInfo.profile['subjectType'] === 'legalEntity'
    const isDelegation = Boolean(userInfo.profile.actor)
    const personDelegation = isDelegation && !isCompany

    const accessControlCommonFields = {
      name: m.accessControlDelegations,
      path: ServicePortalPath.AccessControlDelegations,
      navHide: !userInfo.scopes.includes(AuthScope.writeDelegations),
      enabled: personDelegation
        ? false
        : userInfo.scopes.includes(AuthScope.writeDelegations),
      render: () => lazy(() => import('./screens/AccessControl')),
    }

    const routes: ServicePortalRoute[] = [
      {
        ...accessControlCommonFields,
        path: ServicePortalPath.AccessControlDelegations,
      },
      {
        ...accessControlCommonFields,
        path: ServicePortalPath.AccessControlDelegationsToMe,
      },
      {
        name: m.accessControlGrant,
        path: ServicePortalPath.AccessControlDelegationsGrant,
        enabled: userInfo.scopes.includes(AuthScope.writeDelegations),
        render: () => lazy(() => import('./screens/GrantAccess')),
      },
      {
        name: m.accessControlAccess,
        path: ServicePortalPath.AccessControlDelegationAccess,
        enabled: userInfo.scopes.includes(AuthScope.writeDelegations),
        render: () => lazy(() => import('./screens/Access')),
      },
    ]

    return routes
  },
}
