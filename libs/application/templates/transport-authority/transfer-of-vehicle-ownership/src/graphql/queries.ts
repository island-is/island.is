export const GET_CURRENT_VEHICLES_WITH_DEBT_STATUS = `
  query GetCurrentVehiclesWithDebtStatus($input: GetCurrentVehiclesInput!) {
    currentVehiclesWithDebtStatus(input: $input) {
      permno
      make
      color
      role
      isStolen
      isDebtLess
    }
  } 
`

export const GET_VEHICLE_DEBT_STATUS_BY_PERMNO = `
  query GetVehicleDebtStatusByPermno($permno: String!) {
    vehicleDebtStatusByPermno(permno: $permno) {
      isDebtLess
    }
  } 
`

export const GET_VEHICLE_INFORMATION = `
  query GetVehiclesDetail($input: GetVehicleDetailInput!) {
    vehiclesDetail(input: $input) {
      coOwners {
        nationalId
        owner
      }
      operators {
        nationalId
        name
      }
      isOutOfCommission
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
