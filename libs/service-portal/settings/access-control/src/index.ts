import { AuthScope } from '@island.is/auth/scopes'
import { lazy } from 'react'

import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  m,
} from '@island.is/service-portal/core'

export const accessControlModule: ServicePortalModule = {
  name: 'Aðgangsstýring',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const isCompany = userInfo.profile.subjectType === 'legalEntity'
    const isDelegation = Boolean(userInfo.profile.actor)
    const routes: ServicePortalRoute[] = [
      {
        name: m.accessControl,
        path: ServicePortalPath.SettingsAccessControl,
        enabled:
          isCompany || isDelegation
            ? false
            : userInfo.scopes.includes(AuthScope.writeDelegations),
        render: () => lazy(() => import('./screens/AccessControl')),
      },
      {
        name: m.accessControlGrant,
        path: ServicePortalPath.SettingsAccessControlGrant,
        enabled: userInfo.scopes.includes(AuthScope.writeDelegations),
        render: () => lazy(() => import('./screens/GrantAccess')),
      },
      {
        name: m.accessControlAccess,
        path: ServicePortalPath.SettingsAccessControlAccess,
        enabled: userInfo.scopes.includes(AuthScope.writeDelegations),
        render: () => lazy(() => import('./screens/Access')),
      },
    ]

    return routes
  },
}
