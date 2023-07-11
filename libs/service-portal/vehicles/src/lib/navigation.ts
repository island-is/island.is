import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { VehiclePaths } from './paths'

export const vehiclesNavigation: PortalNavigationItem = {
  name: m.vehicles,
  path: VehiclePaths.AssetsMyVehicles,
  icon: {
    icon: 'car',
  },
  children: [
    {
      name: m.myVehicles,
      path: VehiclePaths.AssetsMyVehicles,
      children: [
        {
          // Path param reference
          name: 'id',
          navHide: true,
          path: VehiclePaths.AssetsVehiclesDetail,
        },
      ],
    },
    {
      name: m.vehiclesLookup,
      path: VehiclePaths.AssetsVehiclesLookup,
    },
    {
      name: m.vehiclesDrivingLessons,
      path: VehiclePaths.AssetsVehiclesDrivingLessons,
    },
    {
      name: m.vehiclesHistory,
      path: VehiclePaths.AssetsVehiclesHistory,
    },
    {
      name: m.workMachines,
      path: VehiclePaths.AssetsWorkMachines,
      children: [
        {
          name: 'regNumber',
          navHide: true,
          path: VehiclePaths.AssetsWorkMachinesDetail,
        },
      ],
    },
    {
      name: m.intellectualProperty,
      path: VehiclePaths.AssetsIntellectualPropertiesOverview,
      children: [
        {
          name: 'id',
          navHide: true,
          path: VehiclePaths.AssetsIntellectualPropertiesDesign,
        },
        {
          name: 'id',
          navHide: true,
          path: VehiclePaths.AssetsIntellectualPropertiesTrademark,
        },
        {
          name: 'id',
          navHide: true,
          path: VehiclePaths.AssetsIntellectualPropertiesPatent,
        },
      ],
    },
  ],
  description: m.vehiclesDescription,
}
