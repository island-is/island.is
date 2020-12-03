import { gql } from '@apollo/client'

export const runEndpointTestsMutation = gql`
  mutation RunEndpointTests($input: RunEndpointTestsInput!) {
    runEndpointTests(input: $input) {
      id
      isValid
      message
    }
  }
`
