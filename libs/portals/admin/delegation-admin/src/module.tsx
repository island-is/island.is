import { PortalModule } from '@island.is/portals/core'
import { m } from './lib/messages'
import { DelegationAdminPaths } from './lib/paths'
import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { delegationAdminLoader } from './screens/DelegationAdminDetails/DelegationAdmin.loader'
import { FindDelegationForNationalId } from './screens/Root.action'
import { createDelegationAction } from './screens/CreateDelegation/CreateDelegation.action'

const DelegationAdminScreen = lazy(() =>
  import('./screens/DelegationAdminDetails/DelegationAdmin'),
)
const CreateDelegationScreen = lazy(() =>
  import('./screens/CreateDelegation/CreateDelegation'),
)
const RootScreen = lazy(() => import('./screens/Root'))

const allowedScopes: string[] = [
  AdminPortalScope.delegationSystem,
  AdminPortalScope.delegationSystemAdmin,
]

export const delegationAdminModule: PortalModule = {
  name: m.delegationAdmin,
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes(props) {
    return [
      {
        name: m.delegationAdmin,
        path: DelegationAdminPaths.Root,
        index: true,
        action: FindDelegationForNationalId(props),
        element: <RootScreen />,
        children: [],
      },
      {
        name: m.delegationAdmin,
        path: DelegationAdminPaths.DelegationAdmin,
        element: <DelegationAdminScreen />,
        loader: delegationAdminLoader(props),
      },
      {
        name: m.createNewDelegation,
        path: DelegationAdminPaths.CreateDelegation,
        element: <CreateDelegationScreen />,
        action: createDelegationAction(props),
      },
    ]
  },
}
