import gql from 'graphql-tag'

export const GET_SUBSCRIPTION_CASES = gql`
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

export const GET_TYPES = gql``
