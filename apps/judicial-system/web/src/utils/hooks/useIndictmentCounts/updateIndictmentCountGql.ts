import { gql } from '@apollo/client'

export const UpdateIndictmentCountMutation = gql`
  mutation UpdateIndictmentCountMutation($input: UpdateIndictmentCountInput!) {
    updateIndictmentCount(input: $input) {
      id
    }
  }
`
