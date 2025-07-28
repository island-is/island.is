import { gql } from '@apollo/client'
import { IndividualFragment } from '../fragments/individual'

export const GET_ADDRESS_BY_NATIONALID = gql`
  query formSystemHomeByNationalId(
    $input: String!
    ) {
    formSystemHomeByNationalId(input: $input) {
          heimilisfang {
      postnumer,
      husHeiti
    }
    }
  }
`