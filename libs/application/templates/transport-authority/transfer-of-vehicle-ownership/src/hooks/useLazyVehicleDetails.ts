import { gql } from '@apollo/client'
import { GetVehicleDetailInput, VehiclesDetail } from '@island.is/api/schema'
import { useLazyQuery } from './useLazyQuery'

const query = gql`
  query VehiclesDetail($input: GetVehicleDetailInput!) {
    vehiclesDetail(input: $input) {
      isStolen
      fees {
        hasEncumbrances
      }
      coOwners {
        owner
        nationalId
      }
    }
  }
`

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      vehiclesDetail: VehiclesDetail
    },
    { input: GetVehicleDetailInput }
  >(query)
}
