import { gql } from '@apollo/client'

export const DELETE_APPLICANT = gql`
  mutation FormSystemDeleteApplicant($input: FormSystemDeleteApplicantInput!) {
    formSystemDeleteApplicant(input: $input)
  }
`
