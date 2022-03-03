import { lazy } from 'react'

import { AuthScope } from '@island.is/auth/scopes'
import {
  m,
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'

export const accessControlModule: ServicePortalModule = {
  name: 'Aðgangsstýring',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.accessControl,
        path: ServicePortalPath.SettingsAccessControl,
        enabled: userInfo.scopes.includes(AuthScope.writeDelegations),
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
