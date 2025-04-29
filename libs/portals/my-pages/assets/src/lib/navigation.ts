import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages as s } from '@island.is/portals/my-pages/core'
import { AssetsPaths } from './paths'

export const assetsNavigation: PortalNavigationItem = {
  name: m.assets,
  description: m.assetsDescription,
  path: AssetsPaths.AssetsRoot,
  icon: {
    icon: 'homeWithCar',
  },
  children: [
    {
      name: m.realEstate,
      description: m.realEstateDescription,
      searchTags: [s.assetsHouse],
      path: AssetsPaths.AssetsRealEstate,
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
      searchHide: true,
      path: AssetsPaths.AssetsVehicles,
      children: [
        {
          name: m.myVehicles,
          description: m.vehiclesDescription,
          searchTags: [s.assetsVehicle, s.assetsVehicles],

          path: AssetsPaths.AssetsMyVehicles,
          breadcrumbHide: true,
          children: [
            {
              // Path param reference
              name: 'id',
              navHide: true,
              path: AssetsPaths.AssetsVehiclesDetail,
              children: [
                {
                  name: m.vehicleMileage,
                  navHide: true,
                  path: AssetsPaths.AssetsVehiclesDetailMileage,
                },
              ],
            },
          ],
        },
        {
          name: m.vehiclesRegisterMileage,
          description: m.vehiclesRegisterMileageIntro,
          path: AssetsPaths.AssetsVehiclesBulkMileage,
          children: [
            {
              name: m.vehiclesBulkMileageUpload,
              path: AssetsPaths.AssetsVehiclesBulkMileageUpload,
              navHide: true,
            },
            {
              name: m.vehiclesBulkMileageJobOverview,
              path: AssetsPaths.AssetsVehiclesBulkMileageJobOverview,
              navHide: true,
              children: [
                {
                  name: m.vehiclesBulkMileageJobDetail,
                  path: AssetsPaths.AssetsVehiclesBulkMileageJobDetail,
                  navHide: true,
                },
              ],
            },
          ],
        },
        {
          name: m.vehiclesLookup,
          path: AssetsPaths.AssetsVehiclesLookup,
        },

        {
          name: m.vehiclesHistory,
          description: m.vehiclesHistory,
          path: AssetsPaths.AssetsVehiclesHistory,
        },
      ],
    },
    {
      name: m.intellectualProperties,
      description: m.intellectualPropertiesIntro,
      path: AssetsPaths.AssetsIntellectualProperties,
      children: [
        {
          name: 'id',
          navHide: true,
          path: AssetsPaths.AssetsIntellectualPropertiesDesign,
        },
        {
          name: 'id',
          navHide: true,
          path: AssetsPaths.AssetsIntellectualPropertiesTrademark,
        },
        {
          name: 'id',
          navHide: true,
          path: AssetsPaths.AssetsIntellectualPropertiesPatent,
        },
      ],
    },
    {
      name: m.workMachines,
      description: m.workMachinesIntro,
      searchTags: [s.assetsWorkMachines, s.assetsMachines],
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
}
