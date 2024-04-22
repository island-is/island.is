import gql from 'graphql-tag'

export const GET_PENSION_CALCULATION = gql`
  query GetPensionCalculation($input: SocialInsurancePensionCalculationInput!) {
    getPensionCalculation(input: $input) {
      highlightedItems {
        name
        monthlyAmount
        yearlyAmount
      }
      groups {
        name
        items {
          name
          monthlyAmount
          yearlyAmount
        }
      }
    }
  }
`
