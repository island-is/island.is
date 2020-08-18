import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const documentsModule: ServicePortalModule = {
  name: 'Rafræn skjöl',
  navigation: () => {
    return {
      name: 'Rafræn skjöl',
      url: '/rafraen-skjol',
      icon: 'article',
      // TODO: This should be in actions
      section: 'info',
      order: 2,
    }
  },
  widgets: () => [
    {
      name: 'Rafræn skjöl',
      weight: 1,
      render: () => lazy(() => import('./widgets')),
    },
  ],
  routes: () => [
    {
      name: 'Rafræn skjöl',
      path: '/rafraen-skjol',
      render: () => lazy(() => import('./lib/service-portal-documents')),
    },
  ],
}
