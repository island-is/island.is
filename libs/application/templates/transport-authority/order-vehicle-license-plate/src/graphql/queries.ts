export const GET_CURRENT_VEHICLES_WITH_PLATE_ORDER_CHECKS = `
  query GetCurrentVehiclesWithPlateOrderChecks($input: GetCurrentVehiclesInput!) {
    currentVehiclesWithPlateOrderChecks(input: $input) {
      permno
      make
      color
      role
      duplicateOrderExists
    }
  } 
`

export const GET_VEHICLE_PLATE_ORDER_CHECKS_BY_PERMNO = `
  query GetVehiclePlateOrderChecksByPermno($permno: String!) {
    vehiclePlateOrderChecksByPermno(permno: $permno) {
      duplicateOrderExists
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
