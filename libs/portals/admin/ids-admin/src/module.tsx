import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { IDSAdminPaths } from './lib/paths'
import { AdminPortalScope } from '@island.is/auth/scopes'
import Domains from './screens/Domains'
import Applications from './components/Applications/Applications'
import ApplicationsScreen from './screens/ApplicationsScreen'
import { Features } from '@island.is/react/feature-flags'

const IDSAdmin = lazy(() => import('./screens/IDSAdmin'))

const allowedScopes: string[] = [AdminPortalScope.idsAdmin]

export const idsAdminModule: PortalModule = {
  name: 'Innskráningarkerfi',
  layout: 'full',
  featureFlag: Features.idsAdminNewPortal,
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes() {
    return [
      {
        name: 'Innskráningarkerfi',
        path: IDSAdminPaths.IDSAdmin,
        element: <IDSAdmin />,
      },
      {
        name: 'Applications',
        path: IDSAdminPaths.IDSAdminApplication,
        element: <ApplicationsScreen />,
        children: [
          {
            name: 'Settings',
            path: IDSAdminPaths.IDSAdminApplication,
            element: <div>Settings</div>,
          },
          {
            name: 'Authentication',
            path: IDSAdminPaths.IDSAdminApplicationAuthentication,
            element: <div>Authentication</div>,
          },
          {
            name: 'AdvancedSettings',
            path: IDSAdminPaths.IDSAdminApplicationAdvancedSettings,
            element: <div>AdvancedSettings</div>,
          },
        ],
      },
      {
        name: 'Domains',
        path: IDSAdminPaths.IDSAdminDomains,
        element: <Domains />,
        children: [
          {
            name: 'Applications',
            path: IDSAdminPaths.IDSAdminDomains,
            element: <Applications />,
          },
          {
            name: 'APIs',
            path: IDSAdminPaths.IDSAdminDomainsAPIS,
            element: <div>APIs</div>,
          },
        ],
      },
    ]
  },
}
