import gql from 'graphql-tag'

export const GET_TAX_CALCULATOR_FIELDS = gql`
  query GetTaxCalculatorFields($calculatorType: TaxCalculatorType!) {
    taxCalculatorFields(calculatorType: $calculatorType) {
      key
      inputType
      required
      options
      dependsOn {
        field
        equals
      }
    }
  }
`
