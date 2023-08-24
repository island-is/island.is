import { gql } from '@apollo/client'

export const CreateDefendantMutation = gql`
  mutation CreateDefendant($input: CreateDefendantInput!) {
    createDefendant(input: $input) {
      id
    }
  }
`
