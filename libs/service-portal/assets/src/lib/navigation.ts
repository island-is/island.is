import { PortalNavigationItem } from '@island.is/portals/core'
import { m as coreMessages } from '@island.is/service-portal/core'
import { messages } from '../lib/messages'
import { AssetsPaths } from './paths'

export const assetsNavigation: PortalNavigationItem = {
  name: coreMessages.assets,
  description: coreMessages.realEstateDescription,
  serviceProvider: 'hms',
  serviceProviderTooltip: coreMessages.realEstateTooltip,
  path: AssetsPaths.AssetsRoot,
  icon: {
    icon: 'homeWithCar',
  },
  children: [
    {
      name: coreMessages.realEstate,
      intro: messages.intro,
      displayIntroHeader: true,
      path: AssetsPaths.AssetsRealEstate,
      children: [
        {
          name: 'id',
          heading: messages.realEstate,
          intro: messages.realEstateDetailIntro,
          //displayIntroHeader: true,
          navHide: true,
          path: AssetsPaths.AssetsRealEstateDetail,
        },
      ],
    },
    {
      name: coreMessages.vehicles,
      path: AssetsPaths.AssetsVehicles,
      children: [
        {
          name: coreMessages.myVehicles,
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
                  name: coreMessages.vehicleMileage,
                  navHide: true,
                  path: AssetsPaths.AssetsVehiclesDetailMileage,
                },
              ],
            },
          ],
        },
        {
          name: coreMessages.vehiclesLookup,
          path: AssetsPaths.AssetsVehiclesLookup,
        },
        {
          name: coreMessages.vehiclesBulkMileage,
          path: AssetsPaths.AssetsVehiclesBulkMileage,
          children: [
            {
              name: coreMessages.vehiclesBulkMileageUpload,
              path: AssetsPaths.AssetsVehiclesBulkMileageUpload,
              navHide: true,
            },
            {
              name: coreMessages.vehiclesBulkMileageJobOverview,
              path: AssetsPaths.AssetsVehiclesBulkMileageJobOverview,
              navHide: true,
              children: [
                {
                  name: coreMessages.vehiclesBulkMileageJobDetail,
                  path: AssetsPaths.AssetsVehiclesBulkMileageJobDetail,
                  navHide: true,
                },
              ],
            },
          ],
        },
        {
          name: coreMessages.vehiclesHistory,
          path: AssetsPaths.AssetsVehiclesHistory,
        },
      ],
    },
    {
      name: coreMessages.intellectualProperties,
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
      name: coreMessages.workMachines,
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
