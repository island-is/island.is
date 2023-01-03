import { gql } from '@apollo/client'
import { VehicleOwnerchangeChecksByPermno } from '@island.is/api/schema'
import { GET_VEHICLE_OWNERCHANGE_CHECKS_BY_PERMNO } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      vehicleOwnerchangeChecksByPermno: VehicleOwnerchangeChecksByPermno
    },
    {
      permno: string
    }
  >(
    gql`
      ${GET_VEHICLE_OWNERCHANGE_CHECKS_BY_PERMNO}
    `,
  )
}
