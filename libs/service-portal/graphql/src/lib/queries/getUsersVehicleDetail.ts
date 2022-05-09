import { gql } from '@apollo/client'

export const GET_USERS_VEHICLE_DETAIL = gql`
  query GetUsersVehiclesDetail($input: GetVehicleDetailInput!) {
    getVehicleDetail(input: $input) {
      mainInfo {
        model
        subModel
        regno
        year
        co2
        cubicCapacity
        trailerWithBrakesWeight
        trailerWithoutBrakesWeight
      }
      basicInfo {
        model
        regno
        subModel
        permno
        verno
        year
        country
        preregDateYear
        formerCountry
        importStatus
      }
      registrationInfo {
        firstRegistrationDate
        preRegistrationDate
        newRegistrationDate
        vehicleGroup
        color
        reggroup
        passengers
        useGroup
        driversPassengers
        standingPassengers
      }
      currentOwnerInfo {
        owner
        persidno
        address
        postalcode
        city
        dateOfPurchase
      }
      inspectionInfo {
        type
        date
        result
        plateStatus
        nextInspectionDate
        lastInspectionDate
      }
      technicalInfo {
        engine
        totalWeight
        cubicCapacity
        capacityWeight
        length
        vehicleWeight
        width
        trailerWithoutBrakesWeight
        horsepower
        trailerWithBrakesWeight
        carryingCapacity
        axleTotalWeight
        axle {
          axleMaxWeight
          wheelAxle
        }
      }
      ownersInfo {
        name
        address
        dateOfPurchase
      }
      coOwners {
        persidno
        owner
        address
        postalcode
        city
        dateOfPurchase
      }
      operator {
        persidno
        name
        address
        postalcode
        city
        startDate
        endDate
      }
    }
  }
`
