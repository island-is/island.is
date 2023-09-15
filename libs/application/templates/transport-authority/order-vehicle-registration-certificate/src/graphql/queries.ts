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
