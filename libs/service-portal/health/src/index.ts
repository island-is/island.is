import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'

export const healthModule: ServicePortalModule = {
  name: 'Heilsa',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: 'Heilsa',
        path: ServicePortalPath.HealthRoot,
        enabled: userInfo.scopes.includes(ApiScope.internal),
        render: () =>
          lazy(() => import('./screens/HealthOverview/HealthOverview')),
      },
    ]

    return routes
  },
}
