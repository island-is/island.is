export const GET_CURRENT_VEHICLES = `
  query GetCurrentVehicles($input: GetCurrentVehiclesInput!) {
    currentVehicles(input: $input) {
      permno
      make
      color
      role
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
      updatelocks {
        lockNo
      }
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
      updatelocks {
        lockNo
      }
      ownerChangeErrorMessages {
        errorNo
        defaultMessage
      }
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
    }
  }
`

export const GET_INSURANCE_COMPANIES = `
  query GetInsuranceCompanies {
    transportAuthorityInsuranceCompanies {
      code
      name
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
