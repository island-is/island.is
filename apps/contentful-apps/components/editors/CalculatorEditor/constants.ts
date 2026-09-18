import gql from 'graphql-tag'

import { TaxCalculatorType } from '@island.is/tax-calculators'

import { TaxCalculatorType as ApiTaxCalculatorType } from '../../../graphql/schema'

/* The `equals` members are ALIASED because GraphQL forbids one response name
 * resolving to incompatible scalar types -- `value` is `Boolean!`, `String!`
 * and `Float!` across the three members. */
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

/* Contentful stores the shared enum's value (`withholdingTaxOnWages`); the
 * GraphQL variable needs the schema enum's (`WithholdingTaxOnWages`). Keyed on
 * the shared enum so a fifth calculator fails to compile here. */
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

export const toApiCalculatorType = (
  value: string,
): ApiTaxCalculatorType | undefined =>
  isTaxCalculatorType(value) ? API_TYPE_BY_CONTENTFUL_VALUE[value] : undefined

export const DEBOUNCE_TIME = 150
