import {
  ServicePortalModule,
  ServicePortalPath,
  userHasAccessToScope,
  ServicePortalRoute,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const healthModule: ServicePortalModule = {
  name: 'Heilsa',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
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

    if (userHasAccessToScope(userInfo, 'heilsuvera?')) {
      routes.push({
        name: 'Heilsuvera',
        path: ServicePortalPath.HeilsaHeilsuvera,
      })
      routes.push({
        name: 'Bólusetningar',
        path: ServicePortalPath.HeilsaBolusetningar,
      })
    }

    return routes
  },
}
