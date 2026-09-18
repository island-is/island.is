import gql from 'graphql-tag'

/* The whole input and output contract for one calculator, as metadata rather
 * than results. `inputFields`, `outputFields` and `itemFields` are
 * interface-typed, so every concrete shape has to be asked for by name.
 *
 * The `equals` aliases are not cosmetic: three union members each selecting a
 * field called `value` at a different scalar type collide under GraphQL's
 * overlapping-fields validation, and the document is rejected outright without
 * them. */
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

/* The result of running one calculator. Unlike the metadata query above, every
 * type here is a concrete object rather than an interface, so nothing needs to
 * be asked for by name and no aliases are required.
 *
 * `message` is developer-facing English. It is selected so a failing
 * calculation can be logged with something specific, and is never rendered --
 * `code` is the contract the renderer switches on. */
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
