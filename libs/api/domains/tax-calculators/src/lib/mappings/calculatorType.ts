import type { CalculatorKey } from '@island.is/clients/rsk/calculators'
import { TaxCalculatorType } from '@island.is/tax-calculators'

/* The domain's identity-mediation point: the client never learns about
 * TaxCalculatorType, and consumers never see the client-local CalculatorKey.
 *
 * The client exposes six calculators; only the four TaxCalculatorType declares
 * are reachable, because that enum is what Contentful authors against.
 * `vehicleDepreciation` and `interestBenefit` stay unreachable until it grows,
 * which touches libs/tax-calculators, libs/cms and apps/contentful-apps
 * together. Note the one name that differs between the two vocabularies:
 * WITHHOLDING_TAX_ON_WAGES (`withholdingTaxOnWages`) maps to `withholdingTax`.
 *
 * Keyed on the enum rather than written as a lookup function so a fifth member
 * fails to compile here instead of silently resolving to undefined. */
const CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE: Record<
  TaxCalculatorType,
  CalculatorKey
> = {
  [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]: 'withholdingTax',
  [TaxCalculatorType.CHILD_BENEFIT]: 'childBenefit',
  [TaxCalculatorType.VEHICLE_TAX]: 'vehicleTax',
  [TaxCalculatorType.VEHICLE_BENEFIT]: 'vehicleBenefit',
}

export const toCalculatorKey = (type: TaxCalculatorType): CalculatorKey =>
  CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE[type]
