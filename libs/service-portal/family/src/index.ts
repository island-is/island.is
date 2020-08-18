import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const familyModule: ServicePortalModule = {
  name: 'Fjölskyldan',
  widgets: () => [
    {
      name: 'Fjölskyldan',
      weight: 4,
      render: () => lazy(() => import('./lib/service-portal-family')),
    },
  ],
  routes: () => [
    {
      name: 'Fjölskyldan',
      path: '/fjolskyldan',
      render: () => lazy(() => import('./lib/service-portal-family')),
    },
  ],
}
