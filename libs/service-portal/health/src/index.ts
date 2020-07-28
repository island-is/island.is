import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const healthModule: ServicePortalModule = {
  name: 'Heilsa',
  path: '/heilsa',
  navigation: async (props) => {
    return {
      name: 'Heilsa',
      url: '/heilsa',
      icon: 'plus',
      section: 'info',
      order: 2,
    }
  },
  widgets: () => lazy(() => import('./lib/service-portal-health')),
  render: () => lazy(() => import('./lib/service-portal-health')),
}
