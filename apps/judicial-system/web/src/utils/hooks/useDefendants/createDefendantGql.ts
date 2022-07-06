import { gql } from '@apollo/client'

export const CreateDefendantMutation = gql`
  mutation CreateDefendantMutation($input: CreateDefendantInput!) {
    createDefendant(input: $input) {
      id
    }
  }
`
