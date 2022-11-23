import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const transportsModule: ServicePortalModule = {
  name: 'Samgöngur',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.yourVehicles,
      path: ServicePortalPath.TransportRoot,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () =>
        lazy(() => import('./screens/TransportsOverview/TransportsOverview')),
    },
    {
      name: m.yourVehicles,
      path: ServicePortalPath.TransportVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () =>
        lazy(() => import('./screens/VehiclesOverview/VehiclesOverview')),
    },
    {
      name: m.yourVehicles,
      path: ServicePortalPath.TransportMyVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
    {
      name: m.vehicles,
      path: ServicePortalPath.TransportVehiclesDetail,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/VehicleDetail/VehicleDetail')),
    },
    {
      name: m.vehiclesHistory,
      path: ServicePortalPath.TransportVehiclesHistory,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () =>
        lazy(() => import('./screens/VehicleHistory/VehicleHistory')),
    },
    {
      name: m.vehiclesDrivingLessons,
      path: ServicePortalPath.TransportVehiclesDrivingLessons,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      dynamic: true,
      render: () =>
        lazy(() => import('./screens/DrivingLessonsBook/DrivingLessonsBook')),
    },
    {
      name: m.vehiclesLookup,
      path: ServicePortalPath.TransportVehiclesLookup,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      key: 'VehicleLookup',
      render: () => lazy(() => import('./screens/Lookup/Lookup')),
    },
    {
      name: 'Loftbrú',
      path: ServicePortalPath.TransportLowerAirfare,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      key: 'VehicleLookup',
      render: () => lazy(() => import('./screens/Lookup/Lookup')),
    },
  ],
}
