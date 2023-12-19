import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'

import { restrictionsLoader } from './screens/restrictions/Restrictions.loader'
import { Paths } from './lib/paths'
import { m } from './lib/messages'

const allowedScopes: string[] = [ApiScope.internal]

const Restrictions = lazy(() => import('./screens/restrictions/Restrictions'))

export const restrictionsModule: PortalModule = {
  name: m.restrictions,
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes(args) {
    return [
      {
        name: m.restrictions,
        path: Paths.Restrictions,
        loader: restrictionsLoader(args),
        element: <Restrictions />,
      },
    ]
  },
}
