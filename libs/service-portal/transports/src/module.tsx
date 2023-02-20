import React, { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { TransportPaths } from './lib/paths'

const AirDiscountOverview = lazy(() =>
  import('./screens/AirDiscountOverview/AirDiscountOverview'),
)

const TransportsOverview = lazy(() =>
  import('./screens/TransportsOverview/TransportsOverview'),
)

const Overview = lazy(() => import('./screens/Overview/Overview'))

const VehicleDetail = lazy(() =>
  import('./screens/VehicleDetail/VehicleDetail'),
)
const VehicleHistory = lazy(() =>
  import('./screens/VehicleHistory/VehicleHistory'),
)
const DrivingLessonsBook = lazy(() =>
  import('./screens/DrivingLessonsBook/DrivingLessonsBook'),
)
const Lookup = lazy(() => import('./screens/Lookup/Lookup'))

export const transportsModule: PortalModule = {
  name: 'Farartæki',
  routes: ({ userInfo }) => [
    {
      name: m.transports,
      path: TransportPaths.TransportRoot,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      element: <TransportsOverview />,
    },
    {
      name: m.myVehicles,
      path: TransportPaths.AssetsVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      element: <Overview />,
    },
    {
      name: m.myVehicles,
      path: TransportPaths.AssetsMyVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      element: <Overview />,
    },
    {
      name: m.vehicles,
      path: TransportPaths.AssetsVehiclesDetail,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      element: <VehicleDetail />,
    },
    {
      name: m.vehiclesHistory,
      path: TransportPaths.AssetsVehiclesHistory,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      element: <VehicleHistory />,
    },
    {
      name: m.vehiclesDrivingLessons,
      path: TransportPaths.AssetsVehiclesDrivingLessons,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      dynamic: true,
      element: <DrivingLessonsBook />,
    },
    {
      name: m.vehiclesLookup,
      path: TransportPaths.AssetsVehiclesLookup,
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.internalProcuring),
      key: 'VehicleLookup',
      element: <Lookup />,
    },
    {
      name: m.airDiscount,
      path: TransportPaths.TransportAirDiscount,
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.internalProcuring),
      element: <AirDiscountOverview />,
    },
  ],
}
