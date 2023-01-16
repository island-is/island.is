import { gql } from '@apollo/client'

export const CreateDefendant = gql`
  mutation CreateDefendant($input: CreateDefendantInput!) {
    createDefendant(input: $input) {
      id
    }
  }
`
