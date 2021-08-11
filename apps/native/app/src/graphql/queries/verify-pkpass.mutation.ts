import { gql } from '@apollo/client'

export const VERIFY_PKPASS_MUTATION = gql`
  mutation verifyPkPass($input: VerifyPkPassInput!) {
    verifyPkPass(input: $input) {
      data
      valid
    }
  }
`

export interface VerifyPkpassMutationResponse {
  generatePkPass: {
    data?: string
    valid: boolean
  }
}
