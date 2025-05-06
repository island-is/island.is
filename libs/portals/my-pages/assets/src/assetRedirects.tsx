import { m } from '@island.is/portals/my-pages/core'
import { PortalRoute } from '@island.is/portals/core'
import { AssetsPaths } from './lib/paths'
import { Navigate } from 'react-router-dom'

export const redirects: PortalRoute[] = [
  {
    name: m.vehiclesBulkMileage,
    path: AssetsPaths.AssetsVehiclesBulkMileageOld,
    enabled: true,
    element: <Navigate to={AssetsPaths.AssetsVehiclesBulkMileage} replace />,
  },
  {
    name: m.vehiclesBulkMileageUpload,
    path: AssetsPaths.AssetsVehiclesBulkMileageUploadOld,
    enabled: true,
    element: (
      <Navigate to={AssetsPaths.AssetsVehiclesBulkMileageUpload} replace />
    ),
  },
  {
    name: m.vehiclesBulkMileageJobOverview,
    path: AssetsPaths.AssetsVehiclesBulkMileageJobOverviewOld,
    enabled: true,
    element: (
      <Navigate to={AssetsPaths.AssetsVehiclesBulkMileageJobOverview} replace />
    ),
  },
  {
    name: m.vehiclesBulkMileageJobDetail,
    path: AssetsPaths.AssetsVehiclesBulkMileageJobDetailOld,
    enabled: true,
    element: (
      <Navigate to={AssetsPaths.AssetsVehiclesBulkMileageJobDetail} replace />
    ),
  },
]
