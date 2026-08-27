import gql from 'graphql-tag'

export const GET_TAX_CALCULATOR_FIELDS = gql`
  query GetTaxCalculatorFields($calculatorType: TaxCalculatorType!) {
    taxCalculatorFields(calculatorType: $calculatorType) {
      key
      label
      kind
      required
      unit
      min
      max
      options {
        value
        label
      }
    }
  }
`

export const GET_TAX_CALCULATOR_CALCULATION = gql`
  query GetTaxCalculatorCalculation(
    $calculatorType: TaxCalculatorType!
    $input: [TaxCalculatorInputValue!]!
  ) {
    taxCalculatorCalculation(calculatorType: $calculatorType, input: $input) {
      key
      label
      value
      unit
      group
      emphasis
    }
  }
`
