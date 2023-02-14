import gql from 'graphql-tag'

export const GET_ALLL_CASES = gql`
  query consulationPortalCaseResult {
    consulationPortalCaseResult {
      id
    }
  }
`
