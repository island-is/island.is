import { gql } from '@apollo/client'
import { ScreenFragment } from '../fragments/screen'

export const CREATE_APPLICANT = gql`
  mutation CreateFormSystemApplicantType(
    $input: CreateFormSystemApplicantInput!
  ) {
    createFormSystemApplicantType(input: $input) {
      ...Screen
    }
  }
  ${ScreenFragment}
`
