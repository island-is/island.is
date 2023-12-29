import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { Features } from '@island.is/feature-flags'
import { PortalModule } from '@island.is/portals/core'

import { m } from './lib/messages'
import { Paths } from './lib/paths'
import { restrictionsAction } from './screens/restrictions/Restrictions.action'
import { restrictionsLoader } from './screens/restrictions/Restrictions.loader'

const allowedScopes: string[] = [ApiScope.internal]

const Restrictions = lazy(() => import('./screens/restrictions/Restrictions'))

export const restrictionsModule: PortalModule = {
  name: m.restrictions,
  featureFlag: Features.disableNewDeviceLogins,
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes(args) {
    return [
      {
        name: m.restrictions,
        path: Paths.Restrictions,
        loader: restrictionsLoader(args),
        action: restrictionsAction(args),
        element: <Restrictions />,
      },
    ]
  },
}
