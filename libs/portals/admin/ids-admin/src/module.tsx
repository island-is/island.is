import { lazy } from 'react'

import { PortalModule } from '@island.is/portals/core'
import { Features } from '@island.is/react/feature-flags'
import { IDSAdminPaths } from './lib/paths'
import { AdminPortalScope } from '@island.is/auth/scopes'

const IDSAdmin = lazy(() => import('./screens/IDSAdmin'))

const allowedScopes: string[] = [AdminPortalScope.idsAdmin]

export const idsAdminModule: PortalModule = {
  name: 'IDSAdmin',
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes({ userInfo }) {
    return [
      {
        name: 'IDSAdmin',
        path: IDSAdminPaths.IDSAdmin,
        enabled: userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
        element: <IDSAdmin />,
      },
    ]
  },
}
