import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const settingsModule: ServicePortalModule = {
  name: 'Stillingar',
  widgets: () => [
    {
      name: 'User profile onboarding modal',
      render: () =>
        lazy(() => import('./widgets/UserProfileOnboarding/UserProfile')),
      weight: 3,
      utility: true,
    },
  ],
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: 'Stillingar',
        path: ServicePortalPath.StillingarRoot,
        render: () => lazy(() => import('./lib/service-portal-settings')),
      },
    ]

    return routes
  },
}
