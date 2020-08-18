import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const educationModule: ServicePortalModule = {
  name: 'Menntun',
  widgets: () => [],
  routes: () => [
    {
      name: 'Menntun',
      path: '/menntun',
      render: () => lazy(() => import('./lib/service-portal-education')),
    },
  ],
}
