export const IDENTITY_QUERY = `
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const GET_MACHINE_DETAILS = `
query GetMachineDetails($id: String!) {
  aoshMachineDetails(id: $id) {
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
    supervisorName
    supervisorNationalId
    licensePlateNumber
    _links {
      href
      rel
      method
      displayTitle
    }
  }
}
`

export const APPROVE_OWNER_CHANGE = `
      mutation ConfirmOwnerChange($input: ConfirmOwnerChange!) {
        confirmOwnerChange(input: $input)
      }
    `
