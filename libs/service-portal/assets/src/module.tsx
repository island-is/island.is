import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { AssetsPaths } from './lib/paths'
import { translationLoader } from './screens/Translation.loader'

const AssetsOverview = lazy(() =>
  import('./screens/AssetsOverview/AssetsOverview'),
)
const RealEstateAssetDetail = lazy(() =>
  import('./screens/RealEstateAssetDetail/RealEstateAssetDetail'),
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
const WorkMachinesOverview = lazy(() =>
  import('./screens/WorkMachinesOverview/WorkMachinesOverview'),
)
const WorkMachinesDetail = lazy(() =>
  import('./screens/WorkMachinesDetail/WorkMachinesDetail'),
)

export const assetsModule: PortalModule = {
  name: 'Fasteignir',
  routes: ({ userInfo, client }) => {
    const routes: PortalRoute[] = [
      {
        name: m.realEstate,
        path: AssetsPaths.AssetsRoot,
        enabled: userInfo.scopes.includes(ApiScope.assets),
        element: <AssetsOverview />,
      },
      {
        name: m.detailInfo,
        path: AssetsPaths.AssetsRealEstateDetail,
        enabled: userInfo.scopes.includes(ApiScope.assets),
        element: <RealEstateAssetDetail />,
      },
      {
        name: m.workMachines,
        path: AssetsPaths.AssetsWorkMachines,
        enabled: userInfo.scopes.includes(ApiScope.workMachines),
        key: 'WorkMachines',
        element: <WorkMachinesOverview />,
      },
      {
        name: m.workMachines,
        path: AssetsPaths.AssetsWorkMachinesDetail,
        enabled: userInfo.scopes.includes(ApiScope.workMachines),
        key: 'WorkMachines',
        element: <WorkMachinesDetail />,
      },
      {
        name: m.myVehicles,
        path: AssetsPaths.AssetsVehicles,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        element: <Overview />,
      },
      {
        name: m.myVehicles,
        path: AssetsPaths.AssetsMyVehicles,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        loader: translationLoader({ userInfo, client }),
        element: <Overview />,
      },
      {
        name: m.vehicles,
        path: AssetsPaths.AssetsVehiclesDetail,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        element: <VehicleDetail />,
      },
      {
        name: m.vehiclesHistory,
        path: AssetsPaths.AssetsVehiclesHistory,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        element: <VehicleHistory />,
      },
      {
        name: m.vehiclesDrivingLessons,
        path: AssetsPaths.AssetsVehiclesDrivingLessons,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        dynamic: true,
        element: <DrivingLessonsBook />,
      },
      {
        name: m.vehiclesLookup,
        path: AssetsPaths.AssetsVehiclesLookup,
        enabled:
          userInfo.scopes.includes(ApiScope.internal) ||
          userInfo.scopes.includes(ApiScope.internalProcuring),
        element: <Lookup />,
      },
    ]

    return routes
  },
}
