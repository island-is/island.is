import gql from 'graphql-tag'

import { TaxCalculatorType } from '@island.is/tax-calculators'

import { TaxCalculatorType as ApiTaxCalculatorType } from '../../../graphql/schema'

/* Aliases avoid GraphQL scalar-name collisions. */
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

/* Maps Contentful values to GraphQL enum values. */
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
