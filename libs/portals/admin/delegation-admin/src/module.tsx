import { PortalModule } from '@island.is/portals/core'
import { m } from './lib/messages'
import { DelegationAdminPaths } from './lib/paths'
import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { delegationAdminLoader } from './screens/DelegationAdminDetails/DelegationAdmin.loader'
import { FindDelegationForNationalId } from './screens/Root.action'

const DelegationAdminScreen = lazy(() =>
  import('./screens/DelegationAdminDetails/DelegationAdmin'),
)
const RootScreen = lazy(() => import('./screens/Root'))
const DelegateAdminCreateScreen = lazy(() =>
  import('./screens/DelegationAdminCreate/DelegationAdminCreate'),
)

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
        children: [
          // When ready for Create
          // {
          //   name: m.delegationAdmin,
          //   path: DelegationAdminPaths.DelegationAdminCreate,
          //   element: <DelegateAdminCreateScreen />,
          //   handle: {
          //     backPath: DelegationAdminPaths.Root,
          //   },
          // },
        ],
      },
      {
        name: m.delegationAdmin,
        path: DelegationAdminPaths.DelegationAdmin,
        element: <DelegationAdminScreen />,
        loader: delegationAdminLoader(props),
      },
    ]
  },
}
