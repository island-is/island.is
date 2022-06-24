import { gql } from '@apollo/client'

export const GET_USERS_VEHICLES_HISTORY = gql`
  query GetUsersVehicles {
    vehiclesHistoryList {
      vehicleList {
        permno
        regno
        type
        color
        firstRegDate
        modelYear
        productYear
        role
        operatorStartDate
        operatorEndDate
        outOfUse
        otherOwners
        termination
        vehicleStatus
        plateStatus
        nextInspection {
          nextInspectionDate
          nextInspectionDateIfPassedInspectionToday
        }
        deregistrationDate
      }
    }
  }
`
