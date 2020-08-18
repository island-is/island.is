import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const educationModule: ServicePortalModule = {
  name: 'Menntun',
  navigation: () => ({
    name: 'Menntun',
    url: '/menntun',
    order: 3,
    section: 'info',
    icon: 'search',
    children: [],
  }),
  widgets: () => [],
  routes: () => [
    {
      name: 'Menntun',
      path: '/menntun',
      render: () => lazy(() => import('./lib/service-portal-education')),
    },
  ],
}
