import { gql } from '@apollo/client'

export const GET_USERS_VEHICLE_DETAIL = gql`
  query GetUsersVehiclesDetail($input: GetVehicleDetailInput!) {
    vehiclesDetail(input: $input) {
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
        nationalId
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
        insuranceStatus
        encumbrances
        carTax
        inspectionFine
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
        tyres {
          tyre1
          tyre2
          tyre3
          tyre4
          tyre5
        }
      }
      ownersInfo {
        name
        address
        dateOfPurchase
      }
      coOwners {
        nationalId
        owner
        address
        postalcode
        city
        dateOfPurchase
      }
      operators {
        nationalId
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
