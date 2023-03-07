import gql from 'graphql-tag'

export const GET_ALL_CASES = gql`
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
