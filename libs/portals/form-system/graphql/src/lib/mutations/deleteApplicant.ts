import { gql } from '@apollo/client'

export const DELETE_APPLICANT = gql`
  mutation DeleteFormSystemApplicant($input: FormSystemDeleteApplicantInput!) {
    deleteFormSystemApplicant(input: $input)
  }
`
