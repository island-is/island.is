import { gql } from '@apollo/client'

export const DeleteIndictmentCountMutation = gql`
  mutation DeleteIndictmentCount($input: DeleteIndictmentCountInput!) {
    deleteIndictmentCount(input: $input) {
      deleted
    }
  }
`
