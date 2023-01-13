import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { TransportPaths } from './paths'

export const transportsNavigation: PortalNavigationItem = {
  name: m.vehicles,
  path: TransportPaths.AssetsVehicles,
  icon: {
    icon: 'car',
  },
  children: [
    {
      name: m.myVehicles,
      path: TransportPaths.AssetsMyVehicles,
      children: [
        {
          // Path param reference
          name: 'id',
          navHide: true,
          path: TransportPaths.AssetsVehiclesDetail,
        },
      ],
    },
    {
      name: m.vehiclesLookup,
      path: TransportPaths.AssetsVehiclesLookup,
    },
    {
      name: m.vehiclesDrivingLessons,
      path: TransportPaths.AssetsVehiclesDrivingLessons,
    },
    {
      name: m.vehiclesHistory,
      path: TransportPaths.AssetsVehiclesHistory,
    },
  ],
  description: m.vehiclesDescription,
}
