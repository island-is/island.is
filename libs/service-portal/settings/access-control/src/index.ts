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
    const showDelegation =
      isCompany || isDelegation
        ? false
        : userInfo.scopes.includes(AuthScope.writeDelegations)

    const routes: ServicePortalRoute[] = [
      {
        name: m.accessControl,
        path: ServicePortalPath.SettingsAccessControl,
        navHide: !showDelegation,
        enabled: showDelegation,
        render: () => lazy(() => import('./screens/AccessControl')),
      },
      {
        name: m.accessControlGrant,
        path: ServicePortalPath.SettingsAccessControlGrant,
        enabled:
          showDelegation &&
          userInfo.scopes.includes(AuthScope.writeDelegations),
        render: () => lazy(() => import('./screens/GrantAccess')),
      },
      {
        name: m.accessControlAccess,
        path: ServicePortalPath.SettingsAccessControlAccess,
        enabled:
          showDelegation &&
          userInfo.scopes.includes(AuthScope.writeDelegations),
        render: () => lazy(() => import('./screens/Access')),
      },
    ]

    return routes
  },
}
