import { gql } from '@apollo/client'

export const CreateCourtCaseMutation = gql`
  mutation CreateCourtCaseMutation($input: CreateCourtCaseInput!) {
    createCourtCase(input: $input) {
      courtCaseNumber
    }
  }
`
