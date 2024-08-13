import gql from 'graphql-tag'

export const TemporaryCalculationQuery = gql`
  query TemporaryCalculation(
    $input: SocialInsuranceTemporaryCalculationInput!
  ) {
    getTemporaryCalculations(input: $input) {
      totalPayment
      subtracted
      paidOut
      groups {
        group
        groupId
        total
        monthTotals {
          month
          amount
        }
        rows {
          name
          total
          months {
            month
            amount
          }
        }
      }
    }
  }
`
