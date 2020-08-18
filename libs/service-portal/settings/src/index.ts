import {
  ServicePortalModule,
  ServicePortalNavigationRoot,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const settingsNav: ServicePortalNavigationRoot = {
  name: 'Stillingar',
  url: '/stillingar',
  icon: 'lock',
  section: 'actions',
  order: 4,
  children: [
    {
      name: 'Upplýsingar',
      url: '/stillingar/minar-upplysingar',
    },
    {
      name: 'Umboð',
      url: '/stillingar/umbod',
    },
  ],
}

export const settingsModule: ServicePortalModule = {
  name: 'Stillingar',
  navigation: () => settingsNav,
  widgets: () => [],
  routes: () => [
    {
      name: 'Stillingar',
      path: '/stillingar',
      render: () => lazy(() => import('./lib/service-portal-settings')),
    },
  ],
}
