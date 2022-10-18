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

type VehicleDetailsShort = {
  isStolen: boolean
  fees: {
    hasEncumbrances: boolean
  }
  coOwners: {
    owner: string
    nationalId: string
  }[]
}

export const useLazyVehicleDetails = () => {
  return useLazyQuery<
    {
      vehiclesDetail: VehicleDetailsShort
    },
    { input: GetVehicleDetailInput }
  >(query)
}
