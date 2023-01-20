export const GET_VEHICLE_INFORMATION = `
  query GetVehiclesDetail($input: GetVehicleDetailInput!) {
    vehiclesDetail(input: $input) {
      coOwners {
        nationalId
        owner
      }
    }
  }
`

export const IDENTITY_QUERY = `
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const GET_CURRENT_VEHICLES_WITH_OWNERCHANGE_CHECKS = `
  query GetCurrentVehiclesWithOwnerchangeChecks($input: GetCurrentVehiclesInput!) {
    currentVehiclesWithOwnerchangeChecks(input: $input) {
      permno
      make
      color
      role
      isDebtLess
      ownerChangeErrorMessages {
        errorNo
        defaultMessage
      }
    }
  } 
`

export const GET_VEHICLE_OWNERCHANGE_CHECKS_BY_PERMNO = `
  query GetVehicleOwnerchangeChecksByPermno($permno: String!) {
    vehicleOwnerchangeChecksByPermno(permno: $permno) {
      isDebtLess
      ownerChangeErrorMessages {
        errorNo
        defaultMessage
      }
    }
  } 
`
