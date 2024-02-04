import gql from 'graphql-tag'

export const GET_PENSION_CALCULATION = gql`
  query GetPensionCalculation($input: SocialInsurancePensionCalculationInput!) {
    getPensionCalculation(input: $input) {
      items {
        name
        monthlyAmount
        yearlyAmount
      }
    }
  }
`
