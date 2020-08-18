import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const healthModule: ServicePortalModule = {
  name: 'Heilsa',
  widgets: () => [
    {
      name: 'Heilsa',
      weight: 5,
      render: () => lazy(() => import('./lib/service-portal-health')),
    },
  ],
  routes: () => [
    {
      name: 'Heilsa',
      path: '/heilsa',
      render: () => lazy(() => import('./lib/service-portal-health')),
    },
  ],
}
