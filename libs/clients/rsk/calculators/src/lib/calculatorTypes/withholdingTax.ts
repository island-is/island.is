import { z } from 'zod'

import type { GetWithholdingTaxData } from '../../../gen/fetch'
import { toRskValue } from './toRskValue'

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
export const withholdingTaxInputSchema = z.object({
  paymentFrequency: z.enum(['weekly', 'monthly']).optional(),
  maritalStatus: z
    .enum(['single', 'singleParent', 'marriedOrCohabiting'])
    .optional(),
  incomeYear: z.number().optional(),
  payMonth: z.number().optional(),
  salary: z.number().optional(),
  pensionFundRatio: z.number().optional(),
  privatePensionRatio: z.number().optional(),
  taxCardUtilization: z.number().optional(),
  spouseTaxCardUtilization: z.number().optional(),
  accumulatedPersonalTaxCredit: z.number().optional(),
  vacationPay: z.number().optional(),
  unionDues: z.number().optional(),
  otherDeduction: z.number().optional(),
  employerPensionMatchRatio: z.number().optional(),
  vehicleAllowance: z.number().optional(),
  seamenAccidentInsurancePremium: z.number().optional(),
})

export type WithholdingTaxInput = z.infer<typeof withholdingTaxInputSchema>

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
