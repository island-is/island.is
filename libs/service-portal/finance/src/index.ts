import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const financeModule: ServicePortalModule = {
  name: 'Fjármál',
  widgets: () => [],
  routes: () => [
    {
      name: 'Fjármál',
      path: ServicePortalPath.FjarmalRoot,
      render: () => lazy(() => import('./lib/service-portal-finance')),
    },
  ],
}
