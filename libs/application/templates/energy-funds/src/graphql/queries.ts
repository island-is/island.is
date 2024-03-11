export const GET_VEHICLE_GRANT_BY_VIN = `
  query GetVehicleGrantByVin($vin: String!) {
    energyFundVehicleGrant(vin: $vin) {
      vehicleGrant
      vehicleGrantItemCode
      hasReceivedSubsidy
    }
  } 
`

export const GET_VEHICLE_DETAILS_WITH_GRANT_BY_PERMNO = `
  query GetVehicleDetailsWithGrant($permno: String!) {
    energyFundVehicleDetailsWithGrant(permno: $permno) {
      vehicleGrant
      vehicleGrantItemCode
      hasReceivedSubsidy
      permno
      make
      color
      requireMileage
      newRegistrationDate
      firstRegistrationDate
      vin
    }
  } 
`
