import gql from 'graphql-tag'

export const GET_CUSTOMS_CALCULATOR_PRODUCT_CATEGORIES = gql`
  query CustomsCalculatorProductCategories {
    customsCalculatorProductCategories {
      status {
        type
        code
        message
      }
      errors
      categories {
        parentCategory
        category
        tariffNumber
        description
      }
    }
  }
`

export const GET_CUSTOMS_CALCULATOR_UNITS = gql`
  query CustomsCalculatorUnits($tariffNumber: String!, $referenceDate: String!) {
    customsCalculatorUnits(
      tariffNumber: $tariffNumber
      referenceDate: $referenceDate
    ) {
      status {
        type
        code
        message
      }
      units
      errors
    }
  }
`

export const CALCULATE_CUSTOMS = gql`
  mutation CustomsCalculatorCalculate(
    $input: CustomsCalculatorCalculationInput!
  ) {
    customsCalculatorCalculate(input: $input) {
      status {
        type
        code
        message
      }
      exchangeRate
      errors
      lineCharge {
        reportId
        currencyName
        charges {
          chargeType
          code
          name
          amount
          netAmount
          ratePercent
          rateAmount
        }
      }
    }
  }
`
