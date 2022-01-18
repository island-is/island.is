import { gql } from '@apollo/client'

export const DeleteDefendantMutation = gql`
  mutation DeleteDefendantMutation($input: DeleteDefendantInput!) {
    deleteDefendant(input: $input) {
      deleted
    }
  }
`
