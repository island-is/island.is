import { gql } from '@apollo/client'

export const AUTH_API_SCOPES_QUERY = gql`
  query AuthApiScopes($input: AuthApiScopesInput!) {
    authApiScopes(input: $input) {
      name
      displayName
      group {
        name
        displayName
        description
      }
      description
    }
  }
`
