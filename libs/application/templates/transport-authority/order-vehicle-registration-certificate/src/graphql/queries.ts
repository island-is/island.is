export const GET_VEHICLE_INFORMATION = `
  query GetVehiclesDetail($input: GetVehicleDetailInput!) {
    vehiclesDetail(input: $input) {
      currentOwnerInfo {
        nationalId
        owner
        address
        postalcode
        city
      }
    }
  }
`

export const GET_VEHICLE_BASIC_INFO_BY_PERMNO = `
  query GetVehicleBasicInfoByPermno($permno: String!) {
    vehicleBasicInfoByPermno(permno: $permno) {
      permno
      make
      color
    }
  } 
`
