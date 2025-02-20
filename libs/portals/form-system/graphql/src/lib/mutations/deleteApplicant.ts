import { gql } from '@apollo/client'

export const DELETE_APPLICANT = gql`
  mutation FormSystemDeleteApplicant(
    $input: FormSystemDeleteFormApplicantTypeInput!
  ) {
    formSystemDeleteFormApplicantType(input: $input)
  }
`
