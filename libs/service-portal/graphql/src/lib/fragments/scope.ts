import { gql } from '@apollo/client'

export const AUTH_API_SCOPE_FRAGMENT = gql`
  fragment AuthApiScopeFragment on AuthApiScope {
    name
    displayName
    description
    group {
      name
      displayName
      description
    }
  }
`
