import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'

import { SessionsPaths } from './lib/paths'
import { Features } from '@island.is/react/feature-flags'
import { Navigate } from 'react-router-dom'

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
    )

    const hasAccess = userInfo.scopes.some((scope) =>
      allowedScopes.includes(scope),
    )

    if (useNewRoute) {
      return [
        {
          name: m.sessions,
          path: SessionsPaths.SessionsNew,
          enabled: hasAccess,
          notAvailableForActors: true,
          element: <Sessions />,
        },
        {
          name: m.sessions,
          path: SessionsPaths.Sessions,
          enabled: hasAccess,
          navHide: true,
          notAvailableForActors: true,
          element: <Navigate to={SessionsPaths.SessionsNew} replace />,
        },
      ]
    }

    return [
      {
        name: m.sessions,
        path: SessionsPaths.Sessions,
        enabled: hasAccess,
        notAvailableForActors: true,
        element: <Sessions />,
      },
    ]
  },
}
