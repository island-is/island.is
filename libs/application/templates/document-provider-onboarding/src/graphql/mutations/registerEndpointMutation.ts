import { gql } from '@apollo/client'

export const registerEndpointMutation = gql`
  mutation RegisterEndpoint($input: RegisterEndpointInput!) {
    registerEndpoint(input: $input) {
      audience
      scope
    }
  }
`
