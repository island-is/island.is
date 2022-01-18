import { gql } from '@apollo/client'

export const ExtendCaseMutation = gql`
  mutation ExtendCaseMutation($input: ExtendCaseInput!) {
    extendCase(input: $input) {
      id
      type
    }
  }
`
