import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { TransportPaths } from './lib/paths'

export const transportsModule: PortalModule = {
  name: 'Farartæki',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.yourVehicles,
      path: TransportPaths.AssetsVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
    {
      name: m.yourVehicles,
      path: TransportPaths.AssetsMyVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
    {
      name: m.vehicles,
      path: TransportPaths.AssetsVehiclesDetail,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/VehicleDetail/VehicleDetail')),
    },
    {
      name: m.vehiclesHistory,
      path: TransportPaths.AssetsVehiclesHistory,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () =>
        lazy(() => import('./screens/VehicleHistory/VehicleHistory')),
    },
    {
      name: m.vehiclesDrivingLessons,
      path: TransportPaths.AssetsVehiclesDrivingLessons,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      dynamic: true,
      render: () =>
        lazy(() => import('./screens/DrivingLessonsBook/DrivingLessonsBook')),
    },
    {
      name: m.vehiclesLookup,
      path: TransportPaths.AssetsVehiclesLookup,
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.internalProcuring),
      key: 'VehicleLookup',
      render: () => lazy(() => import('./screens/Lookup/Lookup')),
    },
  ],
}
