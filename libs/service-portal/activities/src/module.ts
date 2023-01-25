import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { Features } from '@island.is/react/feature-flags'

import { m } from './lib/messages'
import { ActivitiesPaths } from './lib/paths'

const allowedScopes: string[] = [ApiScope.internal, ApiScope.internalProcuring]

export const activitiesModule: PortalModule = {
  name: m.activities,
  featureFlag: Features.servicePortalActivitiesModule,
  enabled({ userInfo }) {
    return userInfo.scopes.some((scope) => allowedScopes.includes(scope))
  },
  routes() {
    const routes: PortalRoute[] = [
      {
        name: m.sessions,
        path: ActivitiesPaths.Sessions,
        render: () => lazy(() => import('./screens/Sessions/Sessions')),
      },
    ]

    return routes
  },
}
