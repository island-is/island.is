import type { CalculatorKey } from '@island.is/clients/rsk/calculators'
import { TaxCalculatorType } from '@island.is/tax-calculators'

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
