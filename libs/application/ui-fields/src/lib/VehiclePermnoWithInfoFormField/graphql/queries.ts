export const GET_VEHICLE_BASIC_INFO_BY_PERMNO = `
  query GetVehicleBasicInfoByPermno($permno: String!) {
    vehicleBasicInfoByPermno(permno: $permno) {
      permno
      make
      color
      numberOfAxles
    }
  } 
`
