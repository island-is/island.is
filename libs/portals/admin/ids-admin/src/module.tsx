import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { IDSAdminPaths } from './lib/paths'
import { m } from './lib/messages'
import { createClientAction } from './components/forms/CreateClient/CreateClient.action'
import { tenantsLoader } from './screens/Tenants/Tenants.loader'
import { tenantLoader, tenantLoaderId } from './screens/Tenant/Tenant.loader'
import { clientsLoader } from './screens/Clients/Clients.loader'
import { clientLoader } from './screens/Client/Client.loader'
import { editApplicationAction } from './components/forms/EditApplication/EditApplication.action'
import PublishEnvironment from './components/forms/PublishEnvironment/PublishEnvironment'
import { publishEnvironmentAction } from './components/forms/PublishEnvironment/PublishEnvironment.action'
import { createPermissionAction } from './components/forms/CreatePermission/CreatePermission.action'
import { permissionsListLoader } from './components/PermissionsList/PermissionsList.loader'
import { permissionLoader } from './screens/Permission/Permission.loader'
import { updatePermissionAction } from './components/forms/EditPermission/EditPermission.action'

const IDSAdmin = lazy(() => import('./screens/IDSAdmin'))

// Tenant
const Tenant = lazy(() => import('./screens/Tenant/Tenant'))
const Tenants = lazy(() => import('./screens/Tenants/Tenants'))

// Client
const ClientsScreen = lazy(() => import('./screens/Clients/Clients'))
const ClientScreen = lazy(() => import('./screens/Client/Client'))
const CreateClient = lazy(() =>
  import('./components/forms/CreateClient/CreateClient'),
)

// Permissions
const PermissionsList = lazy(() =>
  import('./components/PermissionsList/PermissionsList'),
)
const PermissionsScreen = lazy(() => import('./screens/Permission/Permission'))
const CreatePermission = lazy(() =>
  import('./components/forms/CreatePermission/CreatePermission'),
)

const allowedScopes: string[] = [
  AdminPortalScope.idsAdmin,
  AdminPortalScope.idsAdminSuperUser,
]

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
            element: <Tenants />,
            loader: tenantsLoader(props),
            navHide: true,
            handle: {
              backPath: IDSAdminPaths.IDSAdmin,
            },
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
                name: m.clients,
                path: IDSAdminPaths.IDSAdminClients,
                loader: clientsLoader(props),
                element: <ClientsScreen />,
                handle: {
                  backPath: IDSAdminPaths.IDSAdmin,
                },
                children: [
                  {
                    name: m.applicationCreate,
                    navHide: true,
                    path: IDSAdminPaths.IDSAdminClientCreate,
                    element: <CreateClient />,
                    action: createClientAction(props),
                  },
                ],
              },
              {
                name: m.settings,
                path: IDSAdminPaths.IDSAdminClient,
                element: <ClientScreen />,
                loader: clientLoader(props),
                action: editApplicationAction(props),
                handle: {
                  backPath: IDSAdminPaths.IDSAdminClients,
                },
                children: [
                  {
                    name: m.publishEnvironment,
                    navHide: true,
                    path: IDSAdminPaths.IDSAdminClientPublish,
                    action: publishEnvironmentAction(props),
                    element: <PublishEnvironment />,
                  },
                ],
              },
              {
                name: m.permissions,
                path: IDSAdminPaths.IDSAdminPermissions,
                element: <PermissionsList />,
                loader: permissionsListLoader(props),
                handle: {
                  backPath: IDSAdminPaths.IDSAdmin,
                },
                children: [
                  {
                    name: m.createPermission,
                    navHide: true,
                    path: IDSAdminPaths.IDSAdminPermissionsCreate,
                    element: <CreatePermission />,
                    action: createPermissionAction(props),
                  },
                ],
              },
              {
                name: m.permissionsManagement,
                navHide: true,
                path: IDSAdminPaths.IDSAdminPermission,
                element: <PermissionsScreen />,
                action: updatePermissionAction(props),
                loader: permissionLoader(props),
                handle: {
                  backPath: IDSAdminPaths.IDSAdminPermissions,
                },
              },
            ],
          },
        ],
      },
    ]
  },
}
