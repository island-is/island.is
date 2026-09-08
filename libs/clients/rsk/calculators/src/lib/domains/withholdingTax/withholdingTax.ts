import type { GetWithholdingTaxData } from '../../../../gen/fetch'
import { toRskValue } from '../../utils/toRskValue'
import type { WithholdingTaxInput } from './schema'

type OptionValue<TName extends keyof WithholdingTaxInput> = NonNullable<
  WithholdingTaxInput[TName]
>

const RSK_VALUE_BY_PAYMENT_FREQUENCY: Record<
  OptionValue<'paymentFrequency'>,
  boolean
> = {
  weekly: false,
  monthly: true,
}

const RSK_VALUE_BY_MARITAL_STATUS: Record<OptionValue<'maritalStatus'>, number> = {
  single: 1,
  singleParent: 2,
  marriedOrCohabiting: 3,
}

const RSK_VALUE_BY_PENSION_FUND_RATIO: Record<
  OptionValue<'pensionFundRatio'>,
  number
> = {
  '0%': 0,
  '4%': 0.04,
}

const RSK_VALUE_BY_PRIVATE_PENSION_RATIO: Record<
  OptionValue<'privatePensionRatio'>,
  number
> = {
  '0%': 0,
  '1%': 0.01,
  '2%': 0.02,
  '3%': 0.03,
  '4%': 0.04,
}

const RSK_VALUE_BY_EMPLOYER_PENSION_MATCH_RATIO: Record<
  OptionValue<'employerPensionMatchRatio'>,
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

export const toWithholdingTaxQuery = (
  input: WithholdingTaxInput,
): GetWithholdingTaxData['query'] => ({
  launGreidast: toRskValue(
    input.paymentFrequency,
    RSK_VALUE_BY_PAYMENT_FREQUENCY,
  ),
  hjuskaparstada: toRskValue(input.maritalStatus, RSK_VALUE_BY_MARITAL_STATUS),
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
