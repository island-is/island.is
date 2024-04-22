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

export const VALIDATE_VEHICLE_CO_OWNER_CHANGE = `
  query GetVehicleCoOwnerChangeValidation($answers: CoOwnerChangeAnswers!) {
    vehicleCoOwnerChangeValidation(answers: $answers) {
      hasError
      errorMessages {
        errorNo
        defaultMessage
      }
    }
  } 
`
