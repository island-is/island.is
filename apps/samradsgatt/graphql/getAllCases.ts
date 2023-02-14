import gql from 'graphql-tag'

export const GET_ALL_CASES = gql`
  query consulationPortalCaseResult {
    consulationPortalCaseResult {
      id
    }
  }
`
