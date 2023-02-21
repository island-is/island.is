import gql from 'graphql-tag'

export const GET_ALL_CASES = gql`
  query consulationPortalAllCases {
    consulationPortalAllCases {
      id
    }
  }
`
