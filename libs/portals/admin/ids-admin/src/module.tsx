import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { IDSAdminPaths } from './lib/paths'
import { m } from './lib/messages'
import { createClientAction } from './components/forms/CreateClient/CreateClient.action'
import { tenantsListLoader } from './components/TenantsList/TenantsList.loader'
import { tenantLoader, tenantLoaderId } from './screens/Tenant/Tenant.loader'
import { clientsLoader } from './components/Clients/Clients.loader'
import Client from './components/Client/Client'
import { clientLoader } from './components/Client/Client.loader'
import { editApplicationAction } from './components/forms/EditApplication/EditApplication.action'
import PublishEnvironment from './components/forms/PublishEnvironment/PublishEnvironment'
import { publishEnvironmentAction } from './components/forms/PublishEnvironment/PublishEnvironment.action'
import { createPermissionAction } from './components/forms/CreatePermission/CreatePermission.action'
import { rotateSecretAction } from './components/forms/RotateSecret/RotateSecret.action'
import { permissionsListLoader } from './components/PermissionsList/PermissionsList.loader'
import { permissionLoader } from './screens/PermissionScreen/Permission.loader'
import { updatePermissionAction } from './components/forms/EditPermission/EditPermission.action'

const IDSAdmin = lazy(() => import('./screens/IDSAdmin'))
const Tenant = lazy(() => import('./screens/Tenant/Tenant'))
const TenantsList = lazy(() => import('./components/TenantsList/TenantsList'))
const CreateClient = lazy(() =>
  import('./components/forms/CreateClient/CreateClient'),
)
const Clients = lazy(() => import('./components/Clients/Clients'))
const ClientsScreen = lazy(() => import('./screens/ClientsScreen'))
const RotateSecret = lazy(() =>
  import('./components/forms/RotateSecret/RotateSecret'),
)

const PermissionsList = lazy(() =>
  import('./components/PermissionsList/PermissionsList'),
)
const PermissionsScreen = lazy(() =>
  import('./screens/PermissionScreen/PermissionScreen'),
)

const CreatePermission = lazy(() =>
  import('./components/forms/CreatePermission/CreatePermission'),
)

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
            name: m.clients,
            path: '',
            element: <ClientsScreen />,
            handle: {
              backPath: IDSAdminPaths.IDSAdmin,
            },
            children: [
              {
                name: m.settings,
                path: IDSAdminPaths.IDSAdminClient,
                element: <Client />,
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
                  {
                    name: m.rotateSecret,
                    navHide: true,
                    path: IDSAdminPaths.IDSAdminClientRotateSecret,
                    action: rotateSecretAction(props),
                    element: <RotateSecret />,
                  },
                ],
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
                name: m.clients,
                path: IDSAdminPaths.IDSAdminClients,
                loader: clientsLoader(props),
                element: <Clients />,
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
