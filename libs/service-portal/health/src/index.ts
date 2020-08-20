import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const healthModule: ServicePortalModule = {
  name: 'Heilsa',
  widgets: () => [],
  routes: () => {
    const routes = [
      {
        name: 'Heilsa',
        path: ServicePortalPath.HeilsaRoot,
        render: () => lazy(() => import('./lib/service-portal-health')),
      },
      {
        name: 'Umsóknir um lyfseðla',
        path: ServicePortalPath.UmsoknirLyfsedlar,
        render: () => lazy(() => import('./lib/prescriptionApplications')),
      },
    ]

    return routes
  },
}
