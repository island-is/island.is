import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { IDSAdminPaths } from './lib/paths'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { m } from './lib/messages'
import { createApplicationAction } from './components/forms/CreateApplication/CreateApplication.action'
import { tenantsListLoader } from './components/TenantsList/TenantsList.loader'
import { tenantLoader, tenantLoaderId } from './screens/Tenant/Tenant.loader'
import { applicationsLoader } from './components/Applications/Applications.loader'
import Application from './components/Application/Application'
import { applicationLoader } from './components/Application/Application.loader'
import { editApplicationAction } from './components/forms/EditApplication/EditApplication.action'

const IDSAdmin = lazy(() => import('./screens/IDSAdmin'))
const Tenant = lazy(() => import('./screens/Tenant/Tenant'))
const TenantsList = lazy(() => import('./components/TenantsList/TenantsList'))
const CreateApplication = lazy(() =>
  import('./components/forms/CreateApplication/CreateApplication'),
)
const Applications = lazy(() =>
  import('./components/Applications/Applications'),
)
const ApplicationsScreen = lazy(() => import('./screens/ApplicationsScreen'))

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
                element: <Application />,
                loader: applicationLoader(props),
                action: editApplicationAction(props),
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
            loader: tenantLoader(props),
            id: tenantLoaderId,
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
                children: [
                  {
                    name: m.applicationCreate,
                    navHide: true,
                    path: IDSAdminPaths.IDSAdminApplicationCreate,
                    element: <CreateApplication />,
                    action: createApplicationAction(props),
                  },
                ],
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
