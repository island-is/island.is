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

export const GET_OPERATOR_INFO = `
  query GetVehiclesDetail($input: GetVehicleDetailInput!) {
    vehiclesDetail(input: $input) {
      operators {
        nationalId
        name
        startDate
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

export const GET_VEHICLE_OPERATOR_CHANGE_CHECKS_BY_PERMNO = `
  query GetVehicleOperatorChangeChecksByPermno($permno: String!) {
    vehicleOperatorChangeChecksByPermno(permno: $permno) {
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

export const VALIDATE_VEHICLE_OPERATOR_CHANGE = `
  query GetVehicleOperatorChangeValidation($answers: OperatorChangeAnswers!) {
    vehicleOperatorChangeValidation(answers: $answers) {
      hasError
      errorMessages {
        errorNo
        defaultMessage
      }
    }
  } 
`
