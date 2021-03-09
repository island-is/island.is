import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const healthModule: ServicePortalModule = {
  name: 'Heilsa',
  widgets: () => [],
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: 'Heilsa',
        path: ServicePortalPath.HealthRoot,
        render: () =>
          lazy(() => import('./screens/HealthOverview/HealthOverview')),
      },
    ]

    return routes
  },
}
