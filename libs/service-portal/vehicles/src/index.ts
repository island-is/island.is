import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
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
      path: ServicePortalPath.AssetsVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
    {
      name: m.yourVehicles,
      path: ServicePortalPath.AssetsMyVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
    {
      name: m.vehicles,
      path: ServicePortalPath.AssetsVehiclesDetail,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/VehicleDetail/VehicleDetail')),
    },
    {
      name: m.vehiclesHistory,
      path: ServicePortalPath.AssetsVehiclesHistory,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () =>
        lazy(() => import('./screens/VehicleHistory/VehicleHistory')),
    },
    {
      name: m.vehiclesLookup,
      path: ServicePortalPath.AssetsVehiclesLookup,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      key: 'VehicleLookup',
      render: () => lazy(() => import('./screens/Lookup/Lookup')),
    },
  ],
}
