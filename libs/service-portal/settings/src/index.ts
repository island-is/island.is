import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const settingsModule: ServicePortalModule = {
  name: 'Stillingar',
  widgets: () => [],
  routes: () => [
    {
      name: 'Stillingar',
      path: ServicePortalPath.StillingarRoot,
      catchAll: true,
      render: () => lazy(() => import('./lib/service-portal-settings')),
    },
  ],
}
