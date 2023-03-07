import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { IDSAdminPaths } from './lib/paths'
import { AdminPortalScope } from '@island.is/auth/scopes'
import Tenant from './screens/Tenant'
import Applications from './components/Applications/Applications'
import ApplicationsScreen from './screens/ApplicationsScreen'
import { m } from './lib/messages'
import TenantsList from './components/TenantsList/TenantsList'
import { tenantsListLoader } from './components/TenantsList/TenantsList.loader'
import { applicationsLoader } from './components/Applications/Applications.loader'

const IDSAdmin = lazy(() => import('./screens/IDSAdmin'))

const allowedScopes: string[] = [AdminPortalScope.idsAdmin]

export type IDSAdminRouteHandle = {
  backPath?: string
}

export const idsAdminModule: PortalModule = {
  name: m.idsAdmin,
  layout: 'full',
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes(props) {
    return [
      {
        name: m.idsAdmin,
        path: IDSAdminPaths.IDSAdmin,
        element: <IDSAdmin />,
        children: [
          {
            name: m.idsAdmin,
            path: IDSAdminPaths.IDSAdmin,
            element: <TenantsList />,
            loader: tenantsListLoader(props),
            navHide: true,
            handle: {
              backPath: IDSAdminPaths.IDSAdmin,
            },
          },
          {
            name: m.applications,
            path: '',
            element: <ApplicationsScreen />,
            handle: {
              backPath: IDSAdminPaths.IDSAdmin,
            },
            children: [
              {
                name: m.settings,
                path: IDSAdminPaths.IDSAdminApplication,
                element: <div>Settings</div>,
                handle: {
                  backPath: IDSAdminPaths.IDSAdminTenants,
                },
              },
              {
                name: m.authentication,
                path: IDSAdminPaths.IDSAdminApplicationAuthentication,
                element: <div>Authentication</div>,
                handle: {
                  backPath: IDSAdminPaths.IDSAdminTenants,
                },
              },
              {
                name: m.advancedSettings,
                path: IDSAdminPaths.IDSAdminApplicationAdvancedSettings,
                element: <div>AdvancedSettings</div>,
                handle: {
                  backPath: IDSAdminPaths.IDSAdminTenants,
                },
              },
            ],
          },
          {
            name: m.tenants,
            path: '',
            element: <Tenant />,
            handle: {
              backPath: IDSAdminPaths.IDSAdmin,
            },
            children: [
              {
                name: m.applications,
                path: IDSAdminPaths.IDSAdminTenants,
                loader: applicationsLoader(props),
                element: <Applications />,
                handle: {
                  backPath: IDSAdminPaths.IDSAdmin,
                },
              },
              {
                name: m.apis,
                path: IDSAdminPaths.IDSAdminDomainsAPIS,
                element: <div>APIs</div>,
                handle: {
                  backPath: IDSAdminPaths.IDSAdmin,
                },
              },
            ],
          },
        ],
      },
    ]
  },
}
