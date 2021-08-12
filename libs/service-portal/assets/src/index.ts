import { lazy } from 'react'
import { defineMessage } from 'react-intl'
import {
  ServicePortalModule,
  ServicePortalRoute,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const assetsModule: ServicePortalModule = {
  name: 'Eignir',
  widgets: () => [],
  routes: () => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.realEstate,
        path: ServicePortalPath.AssetsRoot,
        render: () =>
          lazy(() => import('./screens/AssetsOverview/AssetsOverview')),
      },
      {
        name: m.vehicles,
        path: ServicePortalPath.AssetsVehicles,
        render: () =>
          lazy(() => import('./screens/AssetsVehicles/AssetsVehicles')),
      },
    ]

    return routes
  },
}
