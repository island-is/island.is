import { gql } from '@apollo/client'
import { IndividualFragment } from '../fragments/individual'

export const GET_NAME_BY_NATIONALID = gql`
  query GetNameByNationalId(
    $input: String!
    ) {
    formSystemNameByNationalId(input: $input) {
      fullName
    }
  }

`