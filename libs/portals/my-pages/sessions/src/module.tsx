import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'

import { SessionsPaths } from './lib/paths'
import { Features } from '@island.is/feature-flags'

const allowedScopes: string[] = [ApiScope.internal, ApiScope.internalProcuring]

const Sessions = lazy(() => import('./screens/Sessions/Sessions'))

export const sessionsModule: PortalModule = {
  name: m.sessions,
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  async routes({ userInfo, featureFlagClient }) {
    const useNewRoute = await featureFlagClient.getValue(
      Features.useNewDelegationSystem,
      false,
      {
        id: userInfo.profile.nationalId,
        attributes: {},
      },
    )

    return [
      {
        name: m.sessions,
        path: useNewRoute ? SessionsPaths.SessionsNew : SessionsPaths.Sessions,
        enabled: userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
        notAvailableForActors: true,
        element: <Sessions />,
      },
    ]
  },
}
