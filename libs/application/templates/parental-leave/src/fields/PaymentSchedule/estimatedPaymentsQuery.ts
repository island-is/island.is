import { gql } from '@apollo/client'

export const getEstimatedPayments = gql`
  query GetEstimatedPayments(
    $input: GetParentalLeavesEstimatedPaymentPlanInput!
  ) {
    getParentalLeavesEstimatedPaymentPlan(input: $input) {
      estimatedAmount
      pensionAmount
      privatePensionAmount
      unionAmount
      taxAmount
      estimatePayment
      period {
        from
        to
        ratio
        approved
        paid
      }
    }
  }
`
