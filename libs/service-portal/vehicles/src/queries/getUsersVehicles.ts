import { gql } from '@apollo/client'

export const GET_USERS_VEHICLES = gql`
  query GetUsersVehicles {
    vehiclesList {
      persidno
      name
      address
      postStation
      vehicleList {
        isCurrent
        permno
        regno
        vin
        type
        color
        firstRegDate
        modelYear
        productYear
        registrationType
        role
        operatorStartDate
        operatorEndDate
        outOfUse
        otherOwners
        termination
        buyerPersidno
        ownerPersidno
        vehicleStatus
        useGroup
        vehGroup
        plateStatus
        nextInspection {
          nextInspectionDate
          nextInspectionDateIfPassedInspectionToday
        }
      }
      createdTimestamp
    }
  }
`
