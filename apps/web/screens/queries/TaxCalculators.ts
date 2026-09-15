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
