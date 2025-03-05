import { gql } from '@apollo/client'

export const UPDATE_APPLICANT = gql`
  mutation UpdateFormSystemApplicant($input: FormSystemUpdateApplicantInput!) {
    updateFormSystemApplicant(input: $input)
  }
`
