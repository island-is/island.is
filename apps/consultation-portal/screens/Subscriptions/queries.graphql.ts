import gql from 'graphql-tag'

export const GET_CASES = gql`
  query consultationPortalGetCases($input: ConsultationPortalCasesInput!) {
    consultationPortalGetCases(input: $input) {
      total
      cases {
        id
        caseNumber
        name
        institutionName
        policyAreaName
      }
    }
  }
`

export const GET_TYPES = gql`
  query consultationPortalAllTypes {
    consultationPortalAllTypes {
      policyAreas
      institutions
    }
  }
`
export const GET_EMAIL = gql`
  query consultationPortalUserEmail {
    consultationPortalUserEmail {
      email
      emailVerified
    }
  }
`
