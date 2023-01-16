import { gql } from '@apollo/client'

export const UpdateDefendant = gql`
  mutation UpdateDefendant($input: UpdateDefendantInput!) {
    updateDefendant(input: $input) {
      id
    }
  }
`
