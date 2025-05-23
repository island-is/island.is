import { gql } from '@apollo/client'
import { BasicVehicleInformation } from '@island.is/api/schema'
import { GET_VEHICLE_BASIC_INFO_BY_PERMNO } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      myVehicleBasicInfoByPermno: BasicVehicleInformation
    },
    {
      permno: string
    }
  >(
    gql`
      ${GET_VEHICLE_BASIC_INFO_BY_PERMNO}
    `,
  )
}
