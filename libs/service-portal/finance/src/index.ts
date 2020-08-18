import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const financeModule: ServicePortalModule = {
  name: 'Fjármál',
  widgets: () => [
    {
      name: 'Fjármál',
      weight: 3,
      render: () => lazy(() => import('./lib/service-portal-finance')),
    },
  ],
  routes: () => [
    {
      name: 'Fjármál',
      path: '/fjarmal',
      render: () => lazy(() => import('./lib/service-portal-finance')),
    },
  ],
}
