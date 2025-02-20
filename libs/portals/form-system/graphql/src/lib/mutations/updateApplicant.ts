import { gql } from '@apollo/client'

export const UPDATE_APPLICANT = gql`
  mutation FormSystemUpdateApplicant(
    $input: FormSystemUpdateFormApplicantTypeInput!
  ) {
    formSystemUpdateFormApplicantType(input: $input)
  }
`
