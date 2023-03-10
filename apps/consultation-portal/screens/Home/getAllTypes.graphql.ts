import gql from 'graphql-tag'

export const GET_ALL_TYPES = gql`
  query consultationPortalAllTypes {
    consultationPortalAllTypes {
      policyAreas
      institutions
      caseStatuses
      caseTypes
    }
  }
`
