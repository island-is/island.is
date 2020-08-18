import { ServicePortalModule } from '@island.is/service-portal/core'
import { lazy } from 'react'

export const documentsModule: ServicePortalModule = {
  name: 'Rafræn skjöl',
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
