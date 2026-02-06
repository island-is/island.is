import gql from 'graphql-tag'

export const PUBLIC_VEHICLE_SEARCH_QUERY = gql`
  query GetPublicVehicleSearch($input: GetPublicVehicleSearchInput!) {
    getPublicVehicleSearch(input: $input) {
      permno
      regno
      vin
      make
      vehicleCommercialName
      color
      firstRegDate
      vehicleStatus
      nextVehicleMainInspection
      co2
      weightedCo2
      co2WLTP
      weightedCo2WLTP
      massLaden
      mass
    }
  }
`
