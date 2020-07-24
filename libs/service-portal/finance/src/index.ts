import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const financeModule: ServicePortalModule = {
  name: 'Fjármál',
  path: '/fjarmal',
  navigation: async (props) => {
    return {
      name: 'Fjármál',
      url: '/fjarmal',
      icon: 'user',
      section: 'info',
      order: 1,
    }
  },
  widgets: () => lazy(() => import('./lib/service-portal-finance')),
  render: () => lazy(() => import('./lib/service-portal-finance')),
}
