import { gql } from '@apollo/client'
import { VehicleDetailsByVin } from '@island.is/api/schema'
import { GET_VEHICLE_DETAILS_BY_VIN } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      vehicleDetailsByVin: VehicleDetailsByVin
    },
    {
      vin: string
    }
  >(
    gql`
      ${GET_VEHICLE_DETAILS_BY_VIN}
    `,
  )
}
