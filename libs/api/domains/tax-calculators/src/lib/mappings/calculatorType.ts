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
 * fails to compile here instead of silently resolving to undefined.
 *
 * `satisfies` rather than an annotation: both give that totality check, but an
 * annotation widens the values back to the full six-member CalculatorKey,
 * which would force unreachable `vehicleDepreciation` and `interestBenefit`
 * branches into every dispatch downstream. */
const CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE = {
  [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES]: 'withholdingTax',
  [TaxCalculatorType.CHILD_BENEFIT]: 'childBenefit',
  [TaxCalculatorType.VEHICLE_TAX]: 'vehicleTax',
  [TaxCalculatorType.VEHICLE_BENEFIT]: 'vehicleBenefit',
} as const satisfies Record<TaxCalculatorType, CalculatorKey>

/* The four keys a request can actually reach: TaxCalculatorType is the GraphQL
 * argument type, so enum coercion rejects anything outside it before a
 * resolver runs. */
export type ReachableCalculatorKey =
  (typeof CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE)[TaxCalculatorType]

export const toCalculatorKey = (
  type: TaxCalculatorType,
): ReachableCalculatorKey => CALCULATOR_KEY_BY_TAX_CALCULATOR_TYPE[type]
