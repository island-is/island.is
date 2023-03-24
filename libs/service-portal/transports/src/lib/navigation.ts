import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { TransportPaths } from './paths'

export const transportsNavigation: PortalNavigationItem = {
  name: m.transports,
  path: TransportPaths.TransportRoot,
  icon: {
    icon: 'car',
  },
  children: [
    {
      name: m.vehicles,
      path: TransportPaths.AssetsVehicles,
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
    },
    {
      name: 'Loftbrú',
      path: TransportPaths.TransportAirDiscount,
    },
  ],
  description: m.vehiclesDescription,
}
