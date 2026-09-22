import type { CalculatorKey } from '@island.is/clients/rsk/calculators'
import { TaxCalculatorType } from '@island.is/tax-calculators'

const calculatorKeys = <T extends Record<TaxCalculatorType, CalculatorKey>>(
  values: T,
): T => values

const CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE = calculatorKeys({
  [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]: 'withholdingTax',
  [TaxCalculatorType.CHILD_BENEFIT]: 'childBenefit',
  [TaxCalculatorType.VEHICLE_TAX]: 'vehicleTax',
  [TaxCalculatorType.VEHICLE_BENEFIT]: 'vehicleBenefit',
} as const)

export type ReachableCalculatorKey = typeof CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE[TaxCalculatorType]

export const toCalculatorKey = (
  type: TaxCalculatorType,
): ReachableCalculatorKey => CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE[type]
