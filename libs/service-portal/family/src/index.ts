import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const familyModule: ServicePortalModule = {
  name: 'Fjölskyldan',
  path: '/fjolskyldan',
  navigation: async (props) => {
    return {
      name: 'Fjölskyldan',
      url: '/fjolskyldan',
      icon: 'user',
      section: 'info',
      order: 0,
    }
  },
  widgets: () => lazy(() => import('./lib/service-portal-family')),
  render: () => lazy(() => import('./lib/service-portal-family')),
}
