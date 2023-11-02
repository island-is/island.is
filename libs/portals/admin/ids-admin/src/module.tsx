import { lazy } from 'react'

import { ModuleErrorScreen, PortalModule } from '@island.is/portals/core'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { IDSAdminPaths } from './lib/paths'
import { m } from './lib/messages'
import { createClientAction } from './screens/Client/CreateClient/CreateClient.action'
import { tenantsLoader } from './screens/Tenants/Tenants.loader'
import { tenantLoader, tenantLoaderId } from './screens/Tenant/Tenant.loader'
import { clientsLoader } from './screens/Clients/Clients.loader'
import { clientLoader } from './screens/Client/Client.loader'
import { editClientAction } from './screens/Client/EditClient.action'
import { createPermissionAction } from './screens/Permission/CreatePermission/CreatePermission.action'
import { permissionsLoader } from './screens/Permissions/Permissions.loader'
import { permissionLoader } from './screens/Permission/Permission.loader'
import { editPermissionAction } from './screens/Permission/EditPermission.action'

const IDSAdmin = lazy(() => import('./screens/IDSAdmin'))

// Tenant
const Tenant = lazy(() => import('./screens/Tenant/Tenant'))
const Tenants = lazy(() => import('./screens/Tenants/Tenants'))

// Client
const ClientsScreen = lazy(() => import('./screens/Clients/Clients'))
const ClientScreen = lazy(() => import('./screens/Client/Client'))
const CreateClient = lazy(() =>
  import('./screens/Client/CreateClient/CreateClient'),
)
const PublishClient = lazy(() =>
  import('./screens/Client/PublishClient/PublishClient'),
)

// Permissions
const Permissions = lazy(() => import('./screens/Permissions/Permissions'))
const Permission = lazy(() => import('./screens/Permission/Permission'))
const CreatePermission = lazy(() =>
  import('./screens/Permission/CreatePermission/CreatePermission'),
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
                action: editClientAction(props),
                errorElement: (
                  <ModuleErrorScreen
                    skipPadding
                    title={props.formatMessage(m.typeNotFound, {
                      type: props.formatMessage(m.client),
                    })}
                    message={props.formatMessage(m.typeNotFoundMessage)}
                  />
                ),
                handle: {
                  backPath: IDSAdminPaths.IDSAdminClients,
                },
              },
              {
                name: m.permissions,
                path: IDSAdminPaths.IDSAdminPermissions,
                element: <Permissions />,
                loader: permissionsLoader(props),
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
                element: <Permission />,
                action: editPermissionAction(props),
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
