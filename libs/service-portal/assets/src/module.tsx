import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { AssetsPaths } from './lib/paths'
import { translationLoader } from './screens/Translation.loader'
import { Navigate } from 'react-router-dom'

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
const Lookup = lazy(() => import('./screens/Lookup/Lookup'))
const WorkMachinesOverview = lazy(() =>
  import('./screens/WorkMachinesOverview/WorkMachinesOverview'),
)
const WorkMachinesDetail = lazy(() =>
  import('./screens/WorkMachinesDetail/WorkMachinesDetail'),
)

const VehicleMileage = lazy(() =>
  import('./screens/VehicleMileage/VehicleMileage'),
)

export const assetsModule: PortalModule = {
  name: 'Fasteignir',
  routes: ({ userInfo, ...rest }) => {
    const routes: PortalRoute[] = [
      {
        name: m.assets,
        path: AssetsPaths.AssetsRoot,
        enabled: [
          ApiScope.assets,
          ApiScope.workMachines,
          ApiScope.vehicles,
          ApiScope.internal,
          ApiScope.internalProcuring,
        ].some((scope) => userInfo.scopes.includes(scope)),
        element: <Navigate to={AssetsPaths.AssetsRealEstate} replace />,
      },
      {
        name: m.realEstate,
        path: AssetsPaths.AssetsRealEstate,
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
        element: <Navigate to={AssetsPaths.AssetsMyVehicles} replace />,
      },
      {
        name: m.myVehicles,
        path: AssetsPaths.AssetsMyVehicles,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        loader: translationLoader({ userInfo, ...rest }),
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
        name: m.vehicleMileage,
        path: AssetsPaths.AssetsVehiclesDetailMileage,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        key: 'VehicleMileage',
        element: <VehicleMileage />,
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
