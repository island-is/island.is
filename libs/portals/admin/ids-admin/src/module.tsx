import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { IDSAdminPaths } from './lib/paths'
import { AdminPortalScope } from '@island.is/auth/scopes'
import Domains from './screens/Domains'

const IDSAdmin = lazy(() => import('./screens/IDSAdmin'))

const allowedScopes: string[] = [AdminPortalScope.idsAdmin]

export const idsAdminModule: PortalModule = {
  name: 'IDSAdmin',
  layout: 'full',
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes() {
    return [
      {
        name: 'IDSAdmin',
        path: IDSAdminPaths.IDSAdmin,
        element: <IDSAdmin />,
      },
      {
        name: 'Domains',
        path: IDSAdminPaths.IDSAdminDomains,
        element: <Domains />,
        children: [
          {
            name: 'Applications',
            path: IDSAdminPaths.IDSAdminDomainsApplications,
            element: <div>Applications</div>,
          },
          {
            name: 'APIs',
            path: IDSAdminPaths.IDSAdminDomainsAPIS,
            element: <div>APIs</div>,
          },
        ],
      },

      // {
      //   name: 'ApplicationsSettings',
      //   path: IDSAdminPaths.IDSAdminDomainsApplications,
      //   element: <div>Applications</div>,
      // },
      // {
      //   name: 'Authentication',
      //   path: IDSAdminPaths.IDSAdminApplicationAuthentication,
      //   element: <div>Authentication</div>,
      // },
      // {
      //   name: 'AdvancedSettings',
      //   path: IDSAdminPaths.IDSAdminApplicationAdvancedSettings,
      //   element: <div>AdvancedSettings</div>,
      // },
    ]
  },
}
