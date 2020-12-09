import { gql } from '@apollo/client'

export const registerProviderMutation = gql`
  mutation RegisterProvider($input: RegisterProviderInput!) {
    registerProvider(input: $input) {
      clientId
      clientSecret
    }
  }
`
