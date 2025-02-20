import { gql } from '@apollo/client'
import { ApplicantFragment } from '../fragments/applicant'

export const CREATE_APPLICANT = gql`
  mutation FormSystemCreateApplicant(
    $input: FormSystemCreateFormApplicantTypeInput!
  ) {
    formSystemCreateFormApplicantType(input: $input) {
      ...FormApplicantTypeDto
    }
  }
  ${ApplicantFragment}
`
