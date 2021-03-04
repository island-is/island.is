import { gql } from '@apollo/client'

export const CreateCustodyCourtCaseMutation = gql`
  mutation CreateCustodyCourtCaseMutation(
    $input: CreateCustodyCourtCaseInput!
  ) {
    createCustodyCourtCase(input: $input) {
      courtCaseNumber
    }
  }
`
