export const IDENTITY_QUERY = `
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const GET_MACHINE_BY_REGNO = `
query GetMachineByRegno($input: WorkMachinesInput!) {
  workMachineForInspection(input: $input) {
    id
    registrationNumber
    type
    subType
    status
    category
    owner {
      name
      number
    }
    licensePlateNumber
    supervisor {
      name
    }
    errorMessage
    disabled
  }
}
`
