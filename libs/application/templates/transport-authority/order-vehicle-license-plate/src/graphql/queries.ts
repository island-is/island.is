export const GET_VEHICLE_PLATE_ORDER_CHECKS_BY_PERMNO = `
  query GetVehiclePlateOrderChecksByPermno($permno: String!) {
    vehiclePlateOrderChecksByPermno(permno: $permno) {
      validationErrorMessages {
        errorNo
        defaultMessage
      }
    }
  } 
`

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
      registrationInfo {
        plateTypeFront
        plateTypeRear
      }
    }
  }
`
