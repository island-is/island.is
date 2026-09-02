import type { GetWithholdingTaxData } from '../../../gen/fetch'
import { toRskValue } from './types'

export type PaymentFrequency = 'weekly' | 'monthly'

export type WithholdingMaritalStatus =
  | 'single'
  | 'singleParent'
  | 'marriedOrCohabiting'

const RSK_VALUE_BY_PAYMENT_FREQUENCY: Record<PaymentFrequency, boolean> = {
  weekly: false,
  monthly: true,
}

const RSK_VALUE_BY_WITHHOLDING_MARITAL_STATUS: Record<
  WithholdingMaritalStatus,
  number
> = {
  single: 1,
  singleParent: 2,
  marriedOrCohabiting: 3,
}

/* Ratios are given as a number between 0 and 1, per the RSK spec. */
export interface WithholdingTaxInput {
  paymentFrequency?: PaymentFrequency
  maritalStatus?: WithholdingMaritalStatus
  incomeYear?: number
  payMonth?: number
  salary?: number
  pensionFundRatio?: number
  privatePensionRatio?: number
  taxCardUtilization?: number
  spouseTaxCardUtilization?: number
  accumulatedPersonalTaxCredit?: number
  vacationPay?: number
  unionDues?: number
  otherDeduction?: number
  employerPensionMatchRatio?: number
  vehicleAllowance?: number
  seamenAccidentInsurancePremium?: number
}

export type WithholdingTaxKey = keyof WithholdingTaxInput

export const toWithholdingTaxQuery = (
  input: WithholdingTaxInput,
): GetWithholdingTaxData['query'] => ({
  launGreidast: toRskValue(
    input.paymentFrequency,
    RSK_VALUE_BY_PAYMENT_FREQUENCY,
  ),
  hjuskaparstada: toRskValue(
    input.maritalStatus,
    RSK_VALUE_BY_WITHHOLDING_MARITAL_STATUS,
  ),
  tekjuar: input.incomeYear,
  launamanudur: input.payMonth,
  laun: input.salary,
  lifeyrissjodurHlutfall: input.pensionFundRatio,
  sereignHlutfall: input.privatePensionRatio,
  nytingSkattkorts: input.taxCardUtilization,
  nytingSkattkortsMaka: input.spouseTaxCardUtilization,
  uppsafnadurPersonuafslattur: input.accumulatedPersonalTaxCredit,
  orlof: input.vacationPay,
  stettarfelag: input.unionDues,
  annad: input.otherDeduction,
  motframlagLifeyrissjodur: input.employerPensionMatchRatio,
  okutaekjastyrkurUtan: input.vehicleAllowance,
  idgjaldSlysatryggingSjomanna: input.seamenAccidentInsurancePremium,
})
