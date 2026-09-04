import gql from 'graphql-tag'

import { TaxCalculatorType } from '@island.is/tax-calculators'

import { TaxCalculatorType as ApiTaxCalculatorType } from '../../../graphql/schema'

/* The backend supplies the input contract only -- keys, types, requiredness and
 * conditionality. It carries no display text of any kind (an earlier version
 * returned `label`, `unit` and `{ value, label }` options; all were removed),
 * so every label in this editor is authored here in `configJson`. */
export const GET_TAX_CALCULATOR_FIELDS = gql`
  query GetTaxCalculatorFieldsForContentfulApp(
    $calculatorType: TaxCalculatorType!
  ) {
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

/* Two vocabularies for the same four calculators: Contentful stores the shared
 * enum's value (`withholdingTaxOnWages`), while the GraphQL variable needs the
 * schema enum's value (`WITHHOLDING_TAX_ON_WAGES`). Written out rather than
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
