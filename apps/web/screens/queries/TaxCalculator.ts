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
