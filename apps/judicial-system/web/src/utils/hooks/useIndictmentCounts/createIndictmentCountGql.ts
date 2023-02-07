import { gql } from '@apollo/client'

export const CreateIndictmentCountMutation = gql`
  mutation CreateIndictmentCountMutation($input: CreateIndictmentCountInput!) {
    createIndictmentCount(input: $input) {
      caseId
      id
      policeCaseNumber
      modified
      created
    }
  }
`
