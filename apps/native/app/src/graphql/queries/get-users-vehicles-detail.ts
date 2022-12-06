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
        weightedCo2
        co2Wltp
        weightedCo2Wltp
        cubicCapacity
        trailerWithBrakesWeight
        trailerWithoutBrakesWeight
      }
      inspectionInfo {
        type
        date
        result
        nextInspectionDate
        lastInspectionDate
        insuranceStatus
        mortages
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
        axles {
          axleMaxWeight
          wheelAxle
        }
        tyres {
          axle1
          axle2
          axle3
          axle4
          axle5
        }
      }
    }
  }
`
