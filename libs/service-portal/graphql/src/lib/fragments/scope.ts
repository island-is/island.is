import { gql } from '@apollo/client'

export const authApiScopeFragment = gql`
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
