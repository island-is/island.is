import gql from 'graphql-tag'

export const AuthDelegationsQuery = gql`
  query AuthDelegationsQuery {
    authDelegations {
      id
      type
      to {
        nationalId
        name
      }
      ... on AuthCustomDelegation {
        validTo
        scopes {
          id
          name
          displayName
          validTo
        }
      }
    }
  }
`
