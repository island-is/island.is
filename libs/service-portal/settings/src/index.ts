import {
  ServicePortalModule,
  ServicePortalNavigationItem,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const settingsNav: ServicePortalNavigationItem = {
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

export const settingsModule: ServicePortalModule = {
  name: 'Stillingar',
  navigation: async () => settingsNav,
  widgets: () => null,
  render: () => lazy(() => import('./lib/service-portal-settings')),
}
