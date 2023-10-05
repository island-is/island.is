import React, { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule } from '@island.is/portals/core'
import { VehiclePaths } from './lib/paths'
import { translationLoader } from './screens/Translation.loader'

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
const WorkMachinesOverview = lazy(() =>
  import('./screens/WorkMachinesOverview/WorkMachinesOverview'),
)
const WorkMachinesDetail = lazy(() =>
  import('./screens/WorkMachinesDetail/WorkMachinesDetail'),
)

export const vehiclesModule: PortalModule = {
  name: 'Ökutæki',
  routes: ({ userInfo, ...rest }) => [
    {
      name: m.yourVehicles,
      path: VehiclePaths.AssetsVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      element: <Overview />,
    },
    {
      name: m.yourVehicles,
      path: VehiclePaths.AssetsMyVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      loader: translationLoader({ userInfo, ...rest }),
      element: <Overview />,
    },
    {
      name: m.vehicles,
      path: VehiclePaths.AssetsVehiclesDetail,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      element: <VehicleDetail />,
    },
    {
      name: m.vehiclesHistory,
      path: VehiclePaths.AssetsVehiclesHistory,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      element: <VehicleHistory />,
    },
    {
      name: m.vehiclesDrivingLessons,
      path: VehiclePaths.AssetsVehiclesDrivingLessons,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      dynamic: true,
      element: <DrivingLessonsBook />,
    },
    {
      name: m.vehiclesLookup,
      path: VehiclePaths.AssetsVehiclesLookup,
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.internalProcuring),
      element: <Lookup />,
    },
    {
      name: m.workMachines,
      path: VehiclePaths.AssetsWorkMachines,
      enabled: userInfo.scopes.includes(ApiScope.workMachines),
      key: 'WorkMachines',
      element: <WorkMachinesOverview />,
    },
    {
      name: m.workMachines,
      path: VehiclePaths.AssetsWorkMachinesDetail,
      enabled: userInfo.scopes.includes(ApiScope.workMachines),
      key: 'WorkMachines',
      element: <WorkMachinesDetail />,
    },
  ],
}
