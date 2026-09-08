import gql from 'graphql-tag'

export const GET_TAX_CALCULATOR_FIELDS = gql`
  query GetTaxCalculatorFields($calculatorType: TaxCalculatorType!) {
    taxCalculator(calculatorType: $calculatorType) {
      fields {
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
  }
`
