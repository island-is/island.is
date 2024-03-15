import gql from 'graphql-tag'

export const GET_HOUSING_BENEFIT_CALCULATION = gql`
  query GetHousingBenefitCalculation(
    $input: HousingBenefitCalculatorCalculationInput!
  ) {
    housingBenefitCalculatorCalculation(input: $input) {
      maximumHousingBenefits
      reductionsDueToIncome
      reductionsDueToAssets
      reductionsDueToHousingCosts
      estimatedHousingBenefits
    }
  }
`

export const GET_SPECIFIC_HOUSING_BENEFIT_SUPPORT_CALCULATION = gql`
  query GetSpecificHousingBenefitSupportCalculation(
    $input: HousingBenefitCalculatorSpecificSupportCalculationInput!
  ) {
    housingBenefitCalculatorSpecificSupportCalculation(input: $input) {
      maximumHousingBenefits
      reductionsDueToHousingCosts
      estimatedHousingBenefits
    }
  }
`
