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
export const GET_VEHICLE_OWNERCHANGE_CHECKS_BY_PERMNO = `
  query GetVehicleOwnerchangeChecksByPermno($permno: String!) {
    vehicleOwnerchangeChecksByPermno(permno: $permno) {
      isDebtLess
      validationErrorMessages {
        errorNo
        defaultMessage
      }
      basicVehicleInformation {
        permno
        make
        color
        role
        requireMileage
      }
    }
  } 
`
