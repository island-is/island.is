export const GET_CURRENT_VEHICLES = `
  query GetCurrentVehicles($input: GetCurrentVehiclesInput!) {
    currentVehicles(input: $input) {
      permno
      make
      color
      role
      isStolen
    }
  } 
`

export const GET_CURRENT_VEHICLES_WITH_FEES = `
  query GetCurrentVehiclesWithFees($input: GetCurrentVehiclesInput!) {
    currentVehiclesWithFees(input: $input) {
      permno
      make
      color
      role
      isStolen
      fees {
        hasEncumbrances
      }
    }
  } 
`

export const GET_VEHICLE_FEES_BY_PERMNO = `
  query GetVehicleFeesByPermno($permno: string!) {
    vehicleFeesByPermno(input: $permno) {
      fees {
        hasEncumbrances
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
      valid
    }
  } 
`
