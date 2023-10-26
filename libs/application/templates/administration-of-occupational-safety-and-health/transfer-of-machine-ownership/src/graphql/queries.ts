export const GET_VEHICLE_OWNERCHANGE_CHECKS_BY_PERMNO = `
  query GetVehicleOwnerchangeChecksByPermno($permno: String!) {
    vehicleOwnerchangeChecksByPermno(permno: $permno) {
      isDebtLess
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

export const IDENTITY_QUERY = `
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const VALIDATE_VEHICLE_OWNER_CHANGE = `
  query GetVehicleOwnerChangeValidation($answers: OwnerChangeAnswers!) {
    vehicleOwnerChangeValidation(answers: $answers) {
      hasError
      errorMessages {
        errorNo
        defaultMessage
      }
    }
  } 
`

export const GET_MACHINE_DETAILS = `
query GetMachineDetails($input: MachineDetailsInput!) {
  machineDetails(input: $input) {
    id
    registrationNumber
    type
    status
    category
    subCategory
    productionYear
    registrationDate
    ownerNumber
    productionNumber
    productionCountry
    licensePlateNumber
    links {
      href
      rel
      method
      displayTitle
    }
  }
}

`

// query GetMachineDetails($id: String) {
//   machineDetails(id: $id) {
//     id
//     registrationNumber
//     type
//     status
//     category
//     subCategory
//     productionYear
//     registrationDate
//     ownerNumber
//     productionNumber
//     productionCountry

//   }
// }

//  _links {
//         href
//         rel
//         method
//         displayTitle
//       }
