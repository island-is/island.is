import { lazy } from 'react'
import { AuthScope } from '@island.is/auth/scopes'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { Features } from '@island.is/feature-flags'
import { m } from '@island.is/service-portal/core'
import { AccessControlPaths } from './lib/paths'

export const accessControlModule: PortalModule = {
  name: 'Aðgangsstýring',
  featureFlag: Features.outgoingDelegationsV1,
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: PortalRoute[] = [
      {
        name: m.accessControl,
        path: AccessControlPaths.SettingsAccessControl,
        navHide: !userInfo.scopes.includes(AuthScope.delegations),
        enabled: userInfo.scopes.includes(AuthScope.delegations),
        render: () => lazy(() => import('./screens/AccessControl')),
      },
      {
        name: m.accessControlGrant,
        path: AccessControlPaths.SettingsAccessControlGrant,
        enabled: userInfo.scopes.includes(AuthScope.delegations),
        render: () => lazy(() => import('./screens/GrantAccess')),
      },
      {
        name: m.accessControlAccess,
        path: AccessControlPaths.SettingsAccessControlAccess,
        enabled: userInfo.scopes.includes(AuthScope.delegations),
        render: () => lazy(() => import('./screens/Access')),
      },
    ]

    return routes
  },
}
