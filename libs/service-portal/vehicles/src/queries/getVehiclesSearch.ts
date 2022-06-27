import { gql } from '@apollo/client'

export const GET_VEHICLES_SEARCH = gql`
  query GetVehiclesSearch($input: GetVehicleSearchInput!) {
    vehiclesSearch(input: $input) {
      permno
      regno
      vin
      type
      color
      firstRegDate
      latestregistration
      nextInspection {
        nextinspectiondate
        nextinspectiondateIfPassedInspectionToday
      }
      currentOwner
      currentOwnerAddress
      useGroup
      regType
      mass
      massLaden
      vehicleStatus
      co
      co2Wltp
      weightedco2Wltp
    }
  }
`
