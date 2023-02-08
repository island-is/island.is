import { gql } from '@apollo/client'

export const DeleteIndictmentCountMutation = gql`
  mutation DeleteIndictmentCountMutation($input: DeleteIndictmentCountInput!) {
    deleteIndictmentCount(input: $input) {
      deleted
    }
  }
`
