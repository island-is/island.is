import { gql } from '@apollo/client'

export const GET_CHARGE_TYPES_BY_YEAR = gql`
  query GetChargeTypesByYear($input: GetChargeTypesByYearInput!) {
    getChargeTypesByYear(input: $input) {
      chargeType {
        ID
        name
      }
    }
  }
`
