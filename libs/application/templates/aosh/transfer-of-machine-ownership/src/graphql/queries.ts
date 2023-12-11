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
    regNumber
    type
    subType
    status
    category
    ownerNumber
    plate
    disabled
    supervisorName
  }
}
`
