import { z } from 'zod'

import type { GetWithholdingTaxData } from '../../../gen/fetch'
import {
  EMPLOYER_PENSION_MATCH_RATIOS,
  PAYMENT_FREQUENCIES,
  PENSION_FUND_RATIOS,
  PRIVATE_PENSION_RATIOS,
  RSK_VALUE_BY_EMPLOYER_PENSION_MATCH_RATIO,
  RSK_VALUE_BY_PAYMENT_FREQUENCY,
  RSK_VALUE_BY_PENSION_FUND_RATIO,
  RSK_VALUE_BY_PRIVATE_PENSION_RATIO,
  RSK_VALUE_BY_WITHHOLDING_MARITAL_STATUS,
  WITHHOLDING_MARITAL_STATUSES,
} from './constants'
import { currency, month, percentage, year } from './semantics'
import { toRskValue } from './toRskValue'

export const withholdingTaxInputSchema = z.object({
  paymentFrequency: z.enum(PAYMENT_FREQUENCIES).optional(),
  maritalStatus: z.enum(WITHHOLDING_MARITAL_STATUSES).optional(),
  incomeYear: year().optional(),
  payMonth: month().optional(),
  salary: currency().optional(),
  pensionFundRatio: z.enum(PENSION_FUND_RATIOS).optional(),
  privatePensionRatio: z.enum(PRIVATE_PENSION_RATIOS).optional(),
  taxCardUtilization: percentage().optional(),
  spouseTaxCardUtilization: percentage().optional(),
  accumulatedPersonalTaxCredit: currency().optional(),
  vacationPay: currency().optional(),
  unionDues: currency().optional(),
  otherDeduction: currency().optional(),
  employerPensionMatchRatio: z.enum(EMPLOYER_PENSION_MATCH_RATIOS).optional(),
  vehicleAllowance: currency().optional(),
  seamenAccidentInsurancePremium: currency().optional(),
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
  lifeyrissjodurHlutfall: toRskValue(
    input.pensionFundRatio,
    RSK_VALUE_BY_PENSION_FUND_RATIO,
  ),
  sereignHlutfall: toRskValue(
    input.privatePensionRatio,
    RSK_VALUE_BY_PRIVATE_PENSION_RATIO,
  ),
  nytingSkattkorts: input.taxCardUtilization,
  nytingSkattkortsMaka: input.spouseTaxCardUtilization,
  uppsafnadurPersonuafslattur: input.accumulatedPersonalTaxCredit,
  orlof: input.vacationPay,
  stettarfelag: input.unionDues,
  annad: input.otherDeduction,
  motframlagLifeyrissjodur: toRskValue(
    input.employerPensionMatchRatio,
    RSK_VALUE_BY_EMPLOYER_PENSION_MATCH_RATIO,
  ),
  okutaekjastyrkurUtan: input.vehicleAllowance,
  idgjaldSlysatryggingSjomanna: input.seamenAccidentInsurancePremium,
})
