import gql from 'graphql-tag'

/* Selects concrete interface fields and aliases conflicting scalar values. */
export const GET_TAX_CALCULATOR = gql`
  query GetTaxCalculator($type: TaxCalculatorType!) {
    taxCalculator(type: $type) {
      type
      inputFields {
        __typename
        key
        type
        required
        dependsOn {
          fieldKey
          equals {
            __typename
            ... on TaxCalculatorBooleanInputDependencyValue {
              booleanValue: value
            }
            ... on TaxCalculatorStringInputDependencyValue {
              stringValue: value
            }
            ... on TaxCalculatorNumberInputDependencyValue {
              numberValue: value
            }
          }
        }
        ... on TaxCalculatorNumberInputField {
          semantic
        }
        ... on TaxCalculatorSelectInputField {
          options {
            value
          }
        }
      }
      outputFields {
        __typename
        key
        type
        ... on TaxCalculatorNumberOutputField {
          semantic
        }
        ... on TaxCalculatorArrayOutputField {
          itemFields {
            __typename
            key
            type
            ... on TaxCalculatorNumberOutputField {
              semantic
            }
          }
        }
      }
    }
  }
`

/* Selects upstream messages for diagnostic logging. */
export const GET_TAX_CALCULATOR_CALCULATION = gql`
  query GetTaxCalculatorCalculation($input: TaxCalculatorCalculateInput!) {
    taxCalculatorCalculate(input: $input) {
      calculation {
        type
        values {
          key
          type
          numberValue
          stringValue
          booleanValue
          arrayValue {
            values {
              key
              type
              numberValue
              stringValue
              booleanValue
            }
          }
        }
      }
      errors {
        code
        key
        message
      }
    }
  }
`
