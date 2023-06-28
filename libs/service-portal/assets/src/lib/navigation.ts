import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { AssetsPaths } from './paths'

export const assetsNavigation: PortalNavigationItem = {
  name: m.assets,
  path: AssetsPaths.AssetsRoot,
  icon: {
    icon: 'home',
  },
  children: [
    {
      name: m.myRealEstate,
      path: AssetsPaths.AssetsRoot,
      children: [
        {
          name: 'id',
          navHide: true,
          path: AssetsPaths.AssetsRealEstateDetail,
        },
      ],
    },
    {
      name: m.vehicles,
      path: AssetsPaths.AssetsVehicles,
      children: [
        {
          name: m.myVehicles,
          path: AssetsPaths.AssetsMyVehicles,
          children: [
            {
              // Path param reference
              name: 'id',
              navHide: true,
              path: AssetsPaths.AssetsVehiclesDetail,
            },
          ],
        },
        {
          name: m.vehiclesLookup,
          path: AssetsPaths.AssetsVehiclesLookup,
        },
        {
          name: m.vehiclesDrivingLessons,
          path: AssetsPaths.AssetsVehiclesDrivingLessons,
        },
        {
          name: m.vehiclesHistory,
          path: AssetsPaths.AssetsVehiclesHistory,
        },
      ],
    },
    {
      name: m.workMachines,
      path: AssetsPaths.AssetsWorkMachines,
      children: [
        {
          name: 'regNumber',
          navHide: true,
          path: AssetsPaths.AssetsWorkMachinesDetail,
        },
      ],
    },
  ],
  description: m.realEstateDescription,
}
