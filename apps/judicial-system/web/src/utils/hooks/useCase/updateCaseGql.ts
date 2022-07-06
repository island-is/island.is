import { gql } from '@apollo/client'

export const UpdateCaseMutation = gql`
  mutation UpdateCaseMutation($input: UpdateCaseInput!) {
    updateCase(input: $input) {
      id
    }
  }
`
