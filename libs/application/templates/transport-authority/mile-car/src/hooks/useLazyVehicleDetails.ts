import { gql } from '@apollo/client'
import { BasicVehicleInformation } from '@island.is/api/schema'
import { GET_VEHICLE_INFORMATION } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      vehicleBasicInfoByPermno: BasicVehicleInformation
    },
    {
      permno: string
    }
  >(
    gql`
      ${GET_VEHICLE_INFORMATION}
    `,
  )
}
