export const GET_VEHICLE_GRANT_BY_VIN = `
  query GetVehicleGrantByVin($vin: String!) {
    energyFundVehicleGrant(vin: $vin) {
      vehicleGrant
      vehicleGrantItemCode
      hasReceivedSubsidy
    }
  } 
`
