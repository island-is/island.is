import { lazy } from 'react'
import { ApiScope } from '@island.is/auth/scopes'
import { m } from '@island.is/portals/my-pages/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { AssetsPaths } from './lib/paths'
import { translationLoader } from './screens/Translation.loader'
import { Navigate } from 'react-router-dom'
import { redirects } from './assetRedirects'

const IPOverview = lazy(() =>
  import(
    './screens/IntellectualPropertiesOverview/IntellectualPropertiesOverview'
  ),
)
const IPDesignDetail = lazy(() =>
  import(
    './screens/IntellectualPropertiesDesignDetail/IntellectualPropertiesDesignDetail'
  ),
)
const IPTrademarkDetail = lazy(() =>
  import(
    './screens/IntellectualPropertiesTrademarkDetail/IntellectualPropertiesTrademarkDetail'
  ),
)
const IPPatentDetail = lazy(() =>
  import(
    './screens/IntellectualPropertiesPatentDetail/IntellectualPropertiesPatentDetail'
  ),
)

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

const VehicleBulkMileage = lazy(() =>
  import('./screens/VehicleBulkMileage/VehicleBulkMileage'),
)

const VehicleBulkMileageUpload = lazy(() =>
  import('./screens/VehicleBulkMileageUpload/VehicleBulkMileageUpload'),
)

const VehicleBulkMileageJobOverview = lazy(() =>
  import(
    './screens/VehicleBulkMileageJobOverview/VehicleBulkMileageJobOverview'
  ),
)
const VehicleBulkMileageJobDetail = lazy(() =>
  import('./screens/VehicleBulkMileageJobDetail/VehicleBulkMileageJobDetail'),
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
        element: <WorkMachinesOverview />,
      },
      {
        name: m.workMachines,
        path: AssetsPaths.AssetsWorkMachinesDetail,
        enabled: userInfo.scopes.includes(ApiScope.workMachines),
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
        element: <VehicleMileage />,
      },
      {
        name: m.vehiclesBulkMileage,
        path: AssetsPaths.AssetsVehiclesBulkMileage,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        element: <VehicleBulkMileage />,
      },
      {
        name: m.vehiclesBulkMileageUpload,
        path: AssetsPaths.AssetsVehiclesBulkMileageUpload,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        element: <VehicleBulkMileageUpload />,
      },
      {
        name: m.vehiclesBulkMileageJobOverview,
        path: AssetsPaths.AssetsVehiclesBulkMileageJobOverview,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        element: <VehicleBulkMileageJobOverview />,
      },
      {
        name: m.vehiclesBulkMileageJobDetail,
        path: AssetsPaths.AssetsVehiclesBulkMileageJobDetail,
        enabled: userInfo.scopes.includes(ApiScope.vehicles),
        element: <VehicleBulkMileageJobDetail />,
      },
      {
        name: m.vehiclesLookup,
        path: AssetsPaths.AssetsVehiclesLookup,
        enabled:
          userInfo.scopes.includes(ApiScope.internal) ||
          userInfo.scopes.includes(ApiScope.internalProcuring),
        element: <Lookup />,
      },
      {
        name: m.intellectualProperties,
        path: AssetsPaths.AssetsIntellectualProperties,
        enabled: userInfo.scopes.includes(ApiScope.intellectualProperties),
        element: <IPOverview />,
      },
      {
        name: m.intellectualProperties,
        path: AssetsPaths.AssetsIntellectualPropertiesDesign,
        enabled: userInfo.scopes.includes(ApiScope.intellectualProperties),
        element: <IPDesignDetail />,
      },
      {
        name: m.intellectualProperties,
        path: AssetsPaths.AssetsIntellectualPropertiesTrademark,
        enabled: userInfo.scopes.includes(ApiScope.intellectualProperties),
        element: <IPTrademarkDetail />,
      },
      {
        name: m.intellectualProperties,
        path: AssetsPaths.AssetsIntellectualPropertiesPatent,
        enabled: userInfo.scopes.includes(ApiScope.intellectualProperties),
        element: <IPPatentDetail />,
      },
      ...redirects,
    ]
    return routes
  },
}
