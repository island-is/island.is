import { lazy } from 'react'

import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const vehiclesModule: ServicePortalModule = {
  name: 'Ökutæki',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.yourVehicles,
      path: ServicePortalPath.AssetsMyVehicles,
      enabled: true,
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
    {
      name: m.vehicles,
      path: ServicePortalPath.AssetsVehiclesDetail,
      enabled: true,
      render: () => lazy(() => import('./screens/VehicleDetail/VehicleDetail')),
    },
    // {
    //   name: 'Uppfletting í ökutækjaskrá',
    //   path: ServicePortalPath.AssetsVehiclesLookup,
    //   enabled: true,
    //   render: () => lazy(() => import('./screens/Lookup/Lookup')),
    // },
  ],
}
