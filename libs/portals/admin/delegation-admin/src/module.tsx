import { PortalModule } from '@island.is/portals/core'
import { m } from './lib/messages'
import { DelegationAdminPaths } from './lib/paths'
import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'

const DelegationAdminScreen = lazy(() => import('./screens/DelegationAdmin'))

const allowedScopes: string[] = [
  AdminPortalScope.delegationSystem,
  AdminPortalScope.delegationSystemAdmin,
]

export const delegationAdminModule: PortalModule = {
  name: m.delegationAdmin,
  layout: 'full',
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes(props) {
    return [
      {
        name: m.delegationAdmin,
        path: DelegationAdminPaths.delegationAdmin,
        element: <DelegationAdminScreen />,
      },
    ]
  },
}
