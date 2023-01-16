import { gql } from '@apollo/client'

export const DeleteDefendant = gql`
  mutation DeleteDefendant($input: DeleteDefendantInput!) {
    deleteDefendant(input: $input) {
      deleted
    }
  }
`
