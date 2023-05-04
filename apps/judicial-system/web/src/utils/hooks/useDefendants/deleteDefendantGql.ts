import { gql } from '@apollo/client'

export const DeleteDefendantMutation = gql`
  mutation DeleteDefendant($input: DeleteDefendantInput!) {
    deleteDefendant(input: $input) {
      deleted
    }
  }
`
