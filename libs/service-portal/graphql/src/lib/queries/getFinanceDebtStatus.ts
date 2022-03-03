import { gql } from '@apollo/client'

export const GET_FINANCE_DEBT_STATUS = gql`
  query getDebtStatusQuery {
    getDebtStatus {
      debtStatus {
        totalAmount
        approvedSchedule
        approvedSchedule
        notPossibleToSchedule
      }
    }
  }
`
