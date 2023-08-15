import gql from 'graphql-tag'

export const GET_HOUSING_BENEFIT_CALCULATION_QUERY = gql`
  query GetHousingBenefitCalculation(
    $input: HousingBenefitCalculatorCalculationInput!
  ) {
    housingBenefitCalculatorCalculation(input: $input) {
      monthlyHousingBenefit
      monthlyIncomeReduction
      monthlyAssetReduction
      monthlyMaxBenefit
      monthlyHousingCostReduction
    }
  }
`
