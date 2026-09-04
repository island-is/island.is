import { z } from 'zod'

import type { GetInterestBenefitData } from '../../../gen/fetch'
import {
  INTEREST_BENEFIT_MARITAL_STATUSES,
  RSK_VALUE_BY_INTEREST_BENEFIT_MARITAL_STATUS,
} from './constants'
import { currency, year } from './semantics'

export const interestBenefitInputSchema = z.object({
  maritalStatus: z.enum(INTEREST_BENEFIT_MARITAL_STATUSES),
  incomeYear: year(),
  incomeBase: currency(),
  assetBase: currency(),
  loanBalance: currency(),
  paidInterest: currency(),
})

export type InterestBenefitInput = z.infer<typeof interestBenefitInputSchema>

export type InterestBenefitKey = keyof InterestBenefitInput

export const toInterestBenefitQuery = (
  input: InterestBenefitInput,
): GetInterestBenefitData['query'] => ({
  hjuskaparstada:
    RSK_VALUE_BY_INTEREST_BENEFIT_MARITAL_STATUS[input.maritalStatus],
  tekjuar: input.incomeYear,
  tekjustofn: input.incomeBase,
  eignastofn: input.assetBase,
  eftirstodvar: input.loanBalance,
  greiddVaxtagjold: input.paidInterest,
})
