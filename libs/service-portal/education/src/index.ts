import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const educationModule: ServicePortalModule = {
  name: 'Menntun',
  path: '/menntun',
  navigation: async () => ({
    name: 'Menntun',
    url: '/menntun',
    order: 3,
    section: 'info',
    icon: 'search',
    children: [],
  }),
  widgets: () => null,
  render: () => lazy(() => import('./lib/service-portal-education')),
}
