import { gql } from '@apollo/client'

export const GET_USERS_VEHICLES = gql`
  query GetUsersVehicles {
    vehiclesUserVehicles {
      nationalId
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
        buyerNationalId
        ownerNationalId
        vehicleStatus
        useGroup
        vehGroup
        plateStatus
      }
      createdTimestamp
    }
  }
`
