import { gql } from '@apollo/client'
import { ScreenFragment } from '../fragments/screen'

export const DELETE_APPLICANT = gql`
  mutation DeleteFormSystemApplicantType(
    $input: DeleteFormSystemApplicantInput!
  ) {
    deleteFormSystemApplicantType(input: $input) {
      ...Screen
    }
  }
  ${ScreenFragment}
`
