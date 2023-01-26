import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { TransportPaths } from './paths'

export const transportsNavigation: PortalNavigationItem = {
  name: m.transports,
  path: TransportPaths.AssetsVehicles,
  icon: {
    icon: 'car',
  },
  serviceProvider: '6IZT17s7stKJAmtPutjpD7',
  children: [
    {
      name: m.myVehicles,
      path: TransportPaths.AssetsMyVehicles,
      serviceProvider: '6IZT17s7stKJAmtPutjpD7',
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
      serviceProvider: '6IZT17s7stKJAmtPutjpD7',
    },
    {
      name: m.vehiclesDrivingLessons,
      path: TransportPaths.AssetsVehiclesDrivingLessons,
      serviceProvider: '6IZT17s7stKJAmtPutjpD7',
    },
    {
      name: m.vehiclesHistory,
      path: TransportPaths.AssetsVehiclesHistory,
      serviceProvider: '6IZT17s7stKJAmtPutjpD7',
    },
  ],
  description: m.vehiclesDescription,
}
