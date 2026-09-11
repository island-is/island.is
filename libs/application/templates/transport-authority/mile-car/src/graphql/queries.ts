export const GET_VEHICLE_INFORMATION = `
  query GetMyVehicleMilesInfo($permno: String!) {
    myVehicleMilesInfoByPermno(permno: $permno) {
      permno
      make
      color
      vehicleHasMilesOdometer
    }
  }
`
