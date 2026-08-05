import { gql } from '@apollo/client'

export const GET_PUBLIC_VEHICLE_SEARCH = gql`
  query publicVehicleSearch($input: GetPublicVehicleSearchInput!) {
    publicVehicleSearch(input: $input) {
      permno
      regno
      vin
      make
      vehicleCommercialName
      color
      vehicleStatus
    }
  }
`
