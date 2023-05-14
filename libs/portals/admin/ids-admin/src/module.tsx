import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { IDSAdminPaths } from './lib/paths'
import { AdminPortalScope } from '@island.is/auth/scopes'
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
import { rotateSecretAction } from './components/forms/RotateSecret/RotateSecret.action'
import { revokeSecretsAction } from './components/forms/RevokeSecrets/RevokeSecrets.action'

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
const RevokeSecrets = lazy(() =>
  import('./components/forms/RevokeSecrets/RevokeSecrets'),
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
                  backPath: IDSAdminPaths.IDSAdminTenants,
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
                  {
                    name: m.revokeSecrets,
                    navHide: true,
                    path: IDSAdminPaths.IDSAdminClientRevokeSecrets,
                    action: revokeSecretsAction(props),
                    element: <RevokeSecrets />,
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
                path: IDSAdminPaths.IDSAdminTenants,
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
