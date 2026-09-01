import gql from 'graphql-tag'

import { TaxCalculatorType } from '@island.is/tax-calculators'

export const GET_TAX_CALCULATOR_FIELDS = gql`
  query GetTaxCalculatorFieldsForContentfulApp(
    $calculatorType: TaxCalculatorType!
  ) {
    taxCalculatorFields(calculatorType: $calculatorType) {
      key
      label
    }
  }
`

/* Contentful stores the enum's value; an untyped gql query sends its member
 * name. Derived from the shared enum so a fifth calculator cannot be added on
 * one side only. */
export const CALCULATOR_TYPE_TO_ENUM: Record<
  string,
  string
> = Object.fromEntries(
  Object.entries(TaxCalculatorType).map(([name, value]) => [value, name]),
)

export const DEBOUNCE_TIME = 150
