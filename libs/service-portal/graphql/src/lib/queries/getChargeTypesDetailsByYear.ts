import { gql } from '@apollo/client'

export const GET_CHARGE_TYPES_DETAILS_BY_YEAR = gql`
  query GetChargeTypesDetailsByYear($input: GetChargeTypesDetailsByYearInput!) {
    getChargeTypesDetailsByYear(input: $input) {
      chargeType {
        ID
        name
        chargeItemSubjects
        chargeItemSubjectDescription
        lastMovementDate
      }
    }
  }
`
