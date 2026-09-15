import gql from 'graphql-tag'

import { TaxCalculatorType } from '@island.is/tax-calculators'

import { TaxCalculatorType as ApiTaxCalculatorType } from '../../../graphql/schema'

/* The backend supplies input and output metadata only -- keys, types,
 * requiredness, conditionality and the shape of each result value. It carries
 * no display text of any kind, so every label in this editor is authored here
 * in `configJson`.
 *
 * Every inline fragment below uses a CONCRETE object type as its condition, not
 * an interface. Apollo's `fragmentMatches` short-circuits on
 * `typename === condition`, so these match without `possibleTypes` -- but
 * `graphql/client.ts` now wires `possibleTypes` in anyway, so an interface
 * condition added later (`... on TaxCalculatorOutputScalarField` is the
 * tempting one) will not silently fail to match.
 *
 * The `equals` members are ALIASED because GraphQL's response-shape rule
 * forbids one response name resolving to incompatible scalar types -- `value`
 * is `Boolean!`, `String!` and `Float!` across the three members, which codegen
 * rejects outright even though the parent types are mutually exclusive. The
 * normalizer collapses whichever alias is present back to a single scalar. */
export const GET_TAX_CALCULATOR_FIELDS = gql`
  query GetTaxCalculatorFieldsForContentfulApp($type: TaxCalculatorType!) {
    taxCalculator(type: $type) {
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

/* Two vocabularies for the same four calculators: Contentful stores the shared
 * enum's value (`withholdingTaxOnWages`), while the GraphQL variable needs the
 * schema enum's value (`WithholdingTaxOnWages`). Written out rather than
 * derived: keying the Record on the shared enum makes it exhaustive, so a fifth
 * calculator added there fails to compile instead of silently producing an
 * undefined variable. Follows the explicit-map style in libs/cms's
 * calculator.model.ts, which exists for the same reason. */
const API_TYPE_BY_CONTENTFUL_VALUE: Record<
  TaxCalculatorType,
  ApiTaxCalculatorType
> = {
  [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]:
    ApiTaxCalculatorType.WithholdingTaxOnWages,
  [TaxCalculatorType.CHILD_BENEFIT]: ApiTaxCalculatorType.ChildBenefit,
  [TaxCalculatorType.VEHICLE_TAX]: ApiTaxCalculatorType.VehicleTax,
  [TaxCalculatorType.VEHICLE_BENEFIT]: ApiTaxCalculatorType.VehicleBenefit,
}

const isTaxCalculatorType = (value: string): value is TaxCalculatorType =>
  Object.values<string>(TaxCalculatorType).includes(value)

/* `undefined` for an unrecognised value, which the editor renders as a warning
 * and uses to skip the query rather than sending a variable the schema will
 * reject. */
export const toApiCalculatorType = (
  value: string,
): ApiTaxCalculatorType | undefined =>
  isTaxCalculatorType(value) ? API_TYPE_BY_CONTENTFUL_VALUE[value] : undefined

export const DEBOUNCE_TIME = 150
