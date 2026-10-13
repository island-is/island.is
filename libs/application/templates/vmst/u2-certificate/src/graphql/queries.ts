import { gql } from '@apollo/client'

export const VALIDATE_U2_QUERY = gql`
  query VmstApplicationsU2Validation(
    $input: VmstApplicationsU2ValidationInput!
  ) {
    vmstApplicationsU2Validation(input: $input) {
      isValid
      reason
      reasonEN
    }
  }
`
