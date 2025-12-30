export const GET_VEHICLE_INFORMATION = `
  query GetVehiclesInformation($permno: String!) {
    vehicleBasicInfoByPermno(permno: $permno) {
      permno
      make
      color
      vehicleHasMilesOdometer
    }
  }
`
