import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'

const HealthOverview = lazy(() =>
  import('./screens/HealthOverview/HealthOverview'),
)

export const healthModule: ServicePortalModule = {
  name: 'Heilsa',
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: 'Heilsa',
        path: ServicePortalPath.HealthRoot,
        enabled: userInfo.scopes.includes(ApiScope.internal),
        element: <HealthOverview />,
      },
    ]

    return routes
  },
}
