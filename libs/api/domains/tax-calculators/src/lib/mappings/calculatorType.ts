import type { CalculatorKey } from '@island.is/clients/rsk/calculators'
import { TaxCalculatorType } from '@island.is/tax-calculators'

/* The client exposes six calculators; only the four TaxCalculatorType declares
 * are reachable, since that enum is what Contentful authors against.
 *
 * `satisfies` rather than an annotation: an annotation would widen the values
 * back to the full six-member CalculatorKey, forcing unreachable branches into
 * every dispatch downstream. */
const CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE = {
  [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]: 'withholdingTax',
  [TaxCalculatorType.CHILD_BENEFIT]: 'childBenefit',
  [TaxCalculatorType.VEHICLE_TAX]: 'vehicleTax',
  [TaxCalculatorType.VEHICLE_BENEFIT]: 'vehicleBenefit',
} as const satisfies Record<TaxCalculatorType, CalculatorKey>

export type ReachableCalculatorKey =
  (typeof CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE)[TaxCalculatorType]

export const toCalculatorKey = (
  type: TaxCalculatorType,
): ReachableCalculatorKey => CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE[type]
