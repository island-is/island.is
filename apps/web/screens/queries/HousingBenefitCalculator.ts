import gql from 'graphql-tag'

export const GET_HOUSING_BENEFIT_CALCULATION = gql`
  query GetHousingBenefitCalculation(
    $input: HousingBenefitCalculatorCalculationInput!
  ) {
    housingBenefitCalculatorCalculation(input: $input) {
      maximumHousingBenefits
      reductionsDueToIncome
      estimatedHousingBenefits
    }
  }
`
