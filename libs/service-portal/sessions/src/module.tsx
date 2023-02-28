import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { Features } from '@island.is/react/feature-flags'
import { m } from '@island.is/service-portal/core'

import { SessionsPaths } from './lib/paths'

const allowedScopes: string[] = [ApiScope.internal, ApiScope.internalProcuring]

const Sessions = lazy(() => import('./screens/Sessions/Sessions'))

export const sessionsModule: PortalModule = {
  name: m.sessions,
  featureFlag: Features.sessionHistory,
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes({ userInfo }) {
    return [
      {
        name: m.sessions,
        path: SessionsPaths.Sessions,
        enabled: userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
        element: <Sessions />,
      },
    ]
  },
}
