import { gql } from '@apollo/client'

export const UpdateDefendantMutation = gql`
  mutation UpdateDefendant($input: UpdateDefendantInput!) {
    updateDefendant(input: $input) {
      id
    }
  }
`
