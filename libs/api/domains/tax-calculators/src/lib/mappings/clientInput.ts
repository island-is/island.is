import {
  EMPLOYER_PENSION_MATCH_RATIOS,
  MARITAL_STATUSES,
  PAYMENT_FREQUENCIES,
  PENSION_FUND_RATIOS,
  PRIVATE_PENSION_RATIOS,
  VEHICLE_TAX_PERIODS,
} from '@island.is/clients/rsk/calculators'
import type {
  ChildBenefitInput,
  VehicleBenefitInput,
  VehicleTaxInput,
  WithholdingTaxInput,
} from '@island.is/clients/rsk/calculators'

import type { SubmittedValues } from '../validation/calculationInput'

/* The generic-in, typed-out boundary. Above this the domain speaks keyed
 * values; below it the client speaks hand-written interfaces that mix required
 * fields with literal unions, so each calculator gets its own builder rather
 * than one generic conversion.
 *
 * These run only after validation has passed, which is what makes the required
 * helpers' throw unreachable -- the same posture as assertPublishableContract.
 * Without them a required field could only be satisfied by a `!` assertion,
 * which is the cast this design exists to avoid. */
const missing = (key: string): never => {
  throw new Error(
    `Validated tax calculator input is missing required field "${key}"`,
  )
}

const mistyped = (key: string, expected: string): never => {
  throw new Error(
    `Validated tax calculator input has a non-${expected} value for "${key}"`,
  )
}

const numberAt = (values: SubmittedValues, key: string): number | undefined => {
  const value = values[key]

  if (value === undefined) {
    return undefined
  }

  return typeof value === 'number' ? value : mistyped(key, 'number')
}

const stringAt = (values: SubmittedValues, key: string): string | undefined => {
  const value = values[key]

  if (value === undefined) {
    return undefined
  }

  return typeof value === 'string' ? value : mistyped(key, 'string')
}

const booleanAt = (
  values: SubmittedValues,
  key: string,
): boolean | undefined => {
  const value = values[key]

  if (value === undefined) {
    return undefined
  }

  return typeof value === 'boolean' ? value : mistyped(key, 'boolean')
}

/* Generic over the permitted values because select fields map to literal
 * unions: validating against the metadata `options` yields a plain `string`,
 * which will not narrow to `'0%' | '4%'`. The lists come from the client,
 * which declares each one once and derives its contract `options`, its input
 * interface and its RSK value maps from it. */
const optionAt = <T extends string>(
  values: SubmittedValues,
  key: string,
  permitted: readonly T[],
): T | undefined => {
  const value = stringAt(values, key)

  if (value === undefined) {
    return undefined
  }

  const match = permitted.find((option) => option === value)

  return match ?? mistyped(key, `permitted option (${permitted.join(', ')})`)
}

const requireNumberAt = (values: SubmittedValues, key: string): number =>
  numberAt(values, key) ?? missing(key)

const requireStringAt = (values: SubmittedValues, key: string): string =>
  stringAt(values, key) ?? missing(key)

const requireBooleanAt = (values: SubmittedValues, key: string): boolean =>
  booleanAt(values, key) ?? missing(key)

const requireOptionAt = <T extends string>(
  values: SubmittedValues,
  key: string,
  permitted: readonly T[],
): T => optionAt(values, key, permitted) ?? missing(key)

export const toChildBenefitInput = (
  values: SubmittedValues,
): ChildBenefitInput => ({
  marriedOrCohabiting: requireBooleanAt(values, 'marriedOrCohabiting'),
  incomeYear: requireNumberAt(values, 'incomeYear'),
  incomeBase: requireNumberAt(values, 'incomeBase'),
  numberOfChildren: requireNumberAt(values, 'numberOfChildren'),
  numberOfChildrenUnder7: requireNumberAt(values, 'numberOfChildrenUnder7'),
  splitCustody: requireBooleanAt(values, 'splitCustody'),
  splitCustodyChildrenOver7: numberAt(values, 'splitCustodyChildrenOver7'),
  splitCustodyChildrenUnder7: numberAt(values, 'splitCustodyChildrenUnder7'),
})

export const toVehicleTaxInput = (
  values: SubmittedValues,
): VehicleTaxInput => ({
  year: requireNumberAt(values, 'year'),
  licensePlate: requireStringAt(values, 'licensePlate'),
  period: requireOptionAt(values, 'period', VEHICLE_TAX_PERIODS),
  periodSplitDate: stringAt(values, 'periodSplitDate'),
})

export const toVehicleBenefitInput = (
  values: SubmittedValues,
): VehicleBenefitInput => ({
  purchaseYear: requireNumberAt(values, 'purchaseYear'),
  purchasePrice: requireNumberAt(values, 'purchasePrice'),
  isElectric: booleanAt(values, 'isElectric'),
  employeePaysCharging: booleanAt(values, 'employeePaysCharging'),
  employeePaysRunningCosts: booleanAt(values, 'employeePaysRunningCosts'),
})

/* Every field is optional here, matching RSK: a bare call returns its own
 * defaults. */
export const toWithholdingTaxInput = (
  values: SubmittedValues,
): WithholdingTaxInput => ({
  paymentFrequency: optionAt(values, 'paymentFrequency', PAYMENT_FREQUENCIES),
  maritalStatus: optionAt(values, 'maritalStatus', MARITAL_STATUSES),
  incomeYear: numberAt(values, 'incomeYear'),
  payMonth: numberAt(values, 'payMonth'),
  salary: numberAt(values, 'salary'),
  pensionFundRatio: optionAt(values, 'pensionFundRatio', PENSION_FUND_RATIOS),
  privatePensionRatio: optionAt(
    values,
    'privatePensionRatio',
    PRIVATE_PENSION_RATIOS,
  ),
  taxCardUtilization: numberAt(values, 'taxCardUtilization'),
  spouseTaxCardUtilization: numberAt(values, 'spouseTaxCardUtilization'),
  accumulatedPersonalTaxCredit: numberAt(
    values,
    'accumulatedPersonalTaxCredit',
  ),
  vacationPay: numberAt(values, 'vacationPay'),
  unionDues: numberAt(values, 'unionDues'),
  otherDeduction: numberAt(values, 'otherDeduction'),
  employerPensionMatchRatio: optionAt(
    values,
    'employerPensionMatchRatio',
    EMPLOYER_PENSION_MATCH_RATIOS,
  ),
  vehicleAllowance: numberAt(values, 'vehicleAllowance'),
  seamenAccidentInsurancePremium: numberAt(
    values,
    'seamenAccidentInsurancePremium',
  ),
})
