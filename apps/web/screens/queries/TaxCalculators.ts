import gql from 'graphql-tag'

/* `inputFields`, `outputFields` and `itemFields` are interface-typed, so every
 * concrete shape is asked for by name. The `equals` aliases are required:
 * three members selecting `value` at different scalar types collide under
 * GraphQL's overlapping-fields validation. */
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

/* `message` is developer-facing English, selected for logging and never
 * rendered -- `code` is what the renderer switches on. */
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
