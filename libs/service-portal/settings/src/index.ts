import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const settingsModule: ServicePortalModule = {
  name: 'Stillingar',
  navigation: async () => {
    return {
      name: 'Stillingar',
      url: '/stillingar',
      icon: 'lock',
      children: [
        {
          name: 'Upplýsingar',
          url: '/stillingar/upplysingar',
        },
        {
          name: 'Umboð',
          url: '/stillingar/umbod',
        },
      ],
    }
  },
  widgets: () => null,
  render: () => lazy(() => import('./lib/service-portal-settings')),
}
