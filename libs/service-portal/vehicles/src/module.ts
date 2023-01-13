import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { VehiclePaths } from './lib/paths'

export const vehiclesModule: PortalModule = {
  name: 'Ökutæki',
  routes: ({ userInfo }) => [
    {
      name: m.yourVehicles,
      path: VehiclePaths.AssetsVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
    {
      name: m.yourVehicles,
      path: VehiclePaths.AssetsMyVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
    {
      name: m.vehicles,
      path: VehiclePaths.AssetsVehiclesDetail,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/VehicleDetail/VehicleDetail')),
    },
    {
      name: m.vehiclesHistory,
      path: VehiclePaths.AssetsVehiclesHistory,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () =>
        lazy(() => import('./screens/VehicleHistory/VehicleHistory')),
    },
    {
      name: m.vehiclesDrivingLessons,
      path: VehiclePaths.AssetsVehiclesDrivingLessons,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      dynamic: true,
      render: () =>
        lazy(() => import('./screens/DrivingLessonsBook/DrivingLessonsBook')),
    },
    {
      name: m.vehiclesLookup,
      path: VehiclePaths.AssetsVehiclesLookup,
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.internalProcuring),
      key: 'VehicleLookup',
      render: () => lazy(() => import('./screens/Lookup/Lookup')),
    },
  ],
}
