import gql from 'graphql-tag'

export const MACHINE_TYPE_BY_REGISTRATION_NUMBER = `
  query GetTypeByRegistrationNumber($registrationNumber: String!, $applicationId: String!) {
    getTypeByRegistrationNumber(registrationNumber: $registrationNumber, applicationId: $applicationId) {
      name
    }
  }
`

export const MACHINE_TYPE_BY_REGISTRATION_NUMBER_QUERY = gql`
  query GetTypeByRegistrationNumber(
    $registrationNumber: String!
    $applicationId: String!
  ) {
    getTypeByRegistrationNumber(
      registrationNumber: $registrationNumber
      applicationId: $applicationId
    ) {
      name
    }
  }
`
