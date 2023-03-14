import gql from 'graphql-tag'

export const GET_CASES = gql`
  query consultationPortalAllCases {
    consultationPortalAllCases {
      id
      caseNumber
      name
      institutionName
      policyAreaName
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
