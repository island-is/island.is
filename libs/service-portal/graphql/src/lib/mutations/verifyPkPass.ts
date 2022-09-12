import { gql } from '@apollo/client'

export const verifyPkPassMutation = gql`
  mutation verifyPkPassMutation($input: VerifyPkPassInput!) {
    verifyPkPass(input: $input) {
      data
      valid
      errors {
        status
        message
        data
      }
    }
  }
`
