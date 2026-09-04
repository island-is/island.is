/* The option sets RSK's calculators offer, and the values RSK's API expects
 * for them. The spec declares none of this: every one of these parameters is
 * an unbounded number or boolean on the wire, so the sets are transcribed from
 * RSK's own forms and kept here rather than inline in the schemas.
 *
 * That transcription is the stopgap, not the design: anything RSK later
 * declares in the spec should be dropped from here and derived instead.
 *
 * Each set is declared once as a tuple, with its union type derived from it,
 * so `z.enum` and the lookup table below it can never list different members. */

export const PAYMENT_FREQUENCIES = ['weekly', 'monthly'] as const

export type PaymentFrequency = typeof PAYMENT_FREQUENCIES[number]

export const RSK_VALUE_BY_PAYMENT_FREQUENCY: Record<PaymentFrequency, boolean> =
  {
    weekly: false,
    monthly: true,
  }

export const WITHHOLDING_MARITAL_STATUSES = [
  'single',
  'singleParent',
  'marriedOrCohabiting',
] as const

export type WithholdingMaritalStatus =
  typeof WITHHOLDING_MARITAL_STATUSES[number]

export const RSK_VALUE_BY_WITHHOLDING_MARITAL_STATUS: Record<
  WithholdingMaritalStatus,
  number
> = {
  single: 1,
  singleParent: 2,
  marriedOrCohabiting: 3,
}

/* The mandatory pension contribution is all-or-nothing at 4%; the private one
 * is offered in whole points up to 4. */
export const PENSION_FUND_RATIOS = ['0%', '4%'] as const

export type PensionFundRatio = typeof PENSION_FUND_RATIOS[number]

export const RSK_VALUE_BY_PENSION_FUND_RATIO: Record<PensionFundRatio, number> =
  {
    '0%': 0,
    '4%': 0.04,
  }

export const PRIVATE_PENSION_RATIOS = ['0%', '1%', '2%', '3%', '4%'] as const

export type PrivatePensionRatio = typeof PRIVATE_PENSION_RATIOS[number]

export const RSK_VALUE_BY_PRIVATE_PENSION_RATIO: Record<
  PrivatePensionRatio,
  number
> = {
  '0%': 0,
  '1%': 0.01,
  '2%': 0.02,
  '3%': 0.03,
  '4%': 0.04,
}

/* The employer's match is negotiated per collective agreement, so the set is
 * neither round nor contiguous -- 11% is genuinely absent between 10.5 and
 * 11.5. */
export const EMPLOYER_PENSION_MATCH_RATIOS = [
  '0%',
  '8%',
  '8.5%',
  '10%',
  '10.5%',
  '11.5%',
  '12%',
  '13.5%',
] as const

export type EmployerPensionMatchRatio =
  typeof EMPLOYER_PENSION_MATCH_RATIOS[number]

export const RSK_VALUE_BY_EMPLOYER_PENSION_MATCH_RATIO: Record<
  EmployerPensionMatchRatio,
  number
> = {
  '0%': 0,
  '8%': 0.08,
  '8.5%': 0.085,
  '10%': 0.1,
  '10.5%': 0.105,
  '11.5%': 0.115,
  '12%': 0.12,
  '13.5%': 0.135,
}

/* Separate from the withholding-tax table: RSK reuses `hjuskaparstada` with a
 * different shape per endpoint, so matching values today are a coincidence. */
export const INTEREST_BENEFIT_MARITAL_STATUSES = [
  'single',
  'singleParent',
  'marriedOrCohabiting',
] as const

export type InterestBenefitMaritalStatus =
  typeof INTEREST_BENEFIT_MARITAL_STATUSES[number]

export const RSK_VALUE_BY_INTEREST_BENEFIT_MARITAL_STATUS: Record<
  InterestBenefitMaritalStatus,
  number
> = {
  single: 1,
  singleParent: 2,
  marriedOrCohabiting: 3,
}

export const VEHICLE_TAX_PERIODS = ['firstHalf', 'secondHalf'] as const

export type VehicleTaxPeriod = typeof VEHICLE_TAX_PERIODS[number]

export const RSK_VALUE_BY_VEHICLE_TAX_PERIOD: Record<
  VehicleTaxPeriod,
  boolean
> = {
  firstHalf: false,
  secondHalf: true,
}
