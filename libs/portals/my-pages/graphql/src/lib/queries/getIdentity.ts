import { gql } from '@apollo/client'

export const IdentityQuery = gql`
  query Identity($input: IdentityInput!) {
    identity(input: $input) {
      nationalId
      type
      name
    }
  }
`
