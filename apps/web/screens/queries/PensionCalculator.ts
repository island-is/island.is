import gql from 'graphql-tag'

export const GET_PENSION_CALCULATION = gql`
  query GetPensionCalculation($input: SocialInsurancePensionCalculationInput!) {
    getPensionCalculation(input: $input) {
      highlightedItem {
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
