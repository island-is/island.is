export const GET_VEHICLE_DETAILS_BY_VIN = `
  query GetVehicleDetailsByVin($vin: String!) {
    vehicleDetailsByVin(vin: $vin) {
      vehicleGrant
      vehicleGrantItemCode
      hasReceivedSubsidy
    }
  } 
`
