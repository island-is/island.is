import { gql } from '@apollo/client'

export const UpdateDefendantMutation = gql`
  mutation UpdateDefendantMutation($input: UpdateDefendantInput!) {
    updateDefendant(input: $input) {
      id
    }
  }
`
