import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { IDSAdminPaths } from './lib/paths'
import { AdminPortalScope } from '@island.is/auth/scopes'
import Tenant from './screens/Tenant'
import Applications from './components/Applications/Applications'
import ApplicationsScreen from './screens/ApplicationsScreen'
import { Features } from '@island.is/react/feature-flags'
import { m } from './lib/messages'

const IDSAdmin = lazy(() => import('./screens/IDSAdmin'))

const allowedScopes: string[] = [AdminPortalScope.idsAdmin]

export const idsAdminModule: PortalModule = {
  name: m.idsAdmin,
  layout: 'full',
  featureFlag: Features.idsAdminNewPortal,
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes() {
    return [
      {
        name: m.idsAdmin,
        path: IDSAdminPaths.IDSAdmin,
        element: <IDSAdmin />,
      },
      {
        name: m.applications,
        path: IDSAdminPaths.IDSAdminApplication,
        element: <ApplicationsScreen />,
        children: [
          {
            name: m.settings,
            path: IDSAdminPaths.IDSAdminApplication,
            element: <div>Settings</div>,
          },
          {
            name: m.authentication,
            path: IDSAdminPaths.IDSAdminApplicationAuthentication,
            element: <div>Authentication</div>,
          },
          {
            name: m.advancedSettings,
            path: IDSAdminPaths.IDSAdminApplicationAdvancedSettings,
            element: <div>AdvancedSettings</div>,
          },
        ],
      },
      {
        name: m.tenants,
        path: IDSAdminPaths.IDSAdminDomains,
        element: <Tenant />,
        children: [
          {
            name: m.applications,
            path: IDSAdminPaths.IDSAdminDomains,
            element: <Applications />,
          },
          {
            name: m.apis,
            path: IDSAdminPaths.IDSAdminDomainsAPIS,
            element: <div>APIs</div>,
          },
        ],
      },
    ]
  },
}
