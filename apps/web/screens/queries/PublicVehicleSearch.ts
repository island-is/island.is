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
      newRegDate
      vehicleStatus
      nextVehicleMainInspection
      co2
      weightedCo2
      co2WLTP
      weightedCo2WLTP
      massLaden
      mass
      co
      typeNumber
    }
  }
`

export const PLATE_AVAILABLE_SEARCH_QUERY = gql`
  query GetPlateAvailability($input: PlateAvailabilityInput!) {
    plateAvailable(input: $input) {
      regno
      available
    }
  }
`
