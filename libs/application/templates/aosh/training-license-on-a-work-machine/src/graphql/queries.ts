export const MACHINE_TYPE_BY_REGISTRATION_NUMBER = `
  query GetTypeByRegistrationNumber($registrationNumber: String!, $applicationId: String!) {
    getTypeByRegistrationNumber(registrationNumber: $registrationNumber, applicationId: $applicationId) {
      name
    }
  }
`
