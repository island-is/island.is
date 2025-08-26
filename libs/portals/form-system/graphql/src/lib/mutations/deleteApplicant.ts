import { gql } from '@apollo/client'

export const DELETE_APPLICANT = gql`
  mutation DeleteFormSystemApplicant($input: DeleteFormSystemApplicantInput!) {
    deleteFormSystemApplicant(input: $input)
  }
`
