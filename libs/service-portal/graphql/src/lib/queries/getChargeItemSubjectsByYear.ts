import { gql } from '@apollo/client'

export const GET_CHARGE_ITEM_SUBJECTS_BY_YEAR = gql`
  query GetChargeItemSubjectsByYear($input: GetChargeItemSubjectsByYearInput!) {
    getChargeItemSubjectsByYear(input: $input) {
      chargeItemSubjects {
        chargeItemSubject
        lastMoveDate
        totalAmount
        periods {
          period
          description
          lastMoveDate
          amount
        }
      }
      more
      nextKey
    }
  }
`
