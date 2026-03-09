export const IDENTITY_QUERY = `
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const GET_MACHINE_DETAILS = `
query GetMachineDetails($id: String!, $rel: String!) {
  getWorkerMachineDetails(id: $id, rel: $rel) {
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
    }
    licensePlateNumber
    supervisor {
      name
    }
    errorMessage
  }
}
`
