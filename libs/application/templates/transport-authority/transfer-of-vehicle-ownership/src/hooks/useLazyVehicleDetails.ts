import { gql } from '@apollo/client'
import { VehicleFeesByPermno } from '@island.is/api/schema'
import { GET_VEHICLE_FEES_BY_PERMNO } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      vehicleFeesByPermno: VehicleFeesByPermno
    },
    {
      permno: string
    }
  >(
    gql`
      ${GET_VEHICLE_FEES_BY_PERMNO}
    `,
  )
}
