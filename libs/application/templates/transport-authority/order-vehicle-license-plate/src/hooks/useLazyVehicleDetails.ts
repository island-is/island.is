import { gql } from '@apollo/client'
import { VehiclePlateOrderChecksByPermno } from '@island.is/api/schema'
import { GET_VEHICLE_PLATE_ORDER_CHECKS_BY_PERMNO } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      vehiclePlateOrderChecksByPermno: VehiclePlateOrderChecksByPermno
    },
    {
      permno: string
    }
  >(
    gql`
      ${GET_VEHICLE_PLATE_ORDER_CHECKS_BY_PERMNO}
    `,
  )
}
