import { z } from 'zod'

import type { GetInterestBenefitData } from '../../../gen/fetch'

export type InterestBenefitMaritalStatus =
  | 'single'
  | 'singleParent'
  | 'marriedOrCohabiting'

// Separate from the withholding-tax table: RSK reuses `hjuskaparstada` with a
// different shape per endpoint, so matching values today are a coincidence.
const RSK_VALUE_BY_INTEREST_BENEFIT_MARITAL_STATUS: Record<
  InterestBenefitMaritalStatus,
  number
> = {
  single: 1,
  singleParent: 2,
  marriedOrCohabiting: 3,
}

export const interestBenefitInputSchema = z.object({
  maritalStatus: z.enum(['single', 'singleParent', 'marriedOrCohabiting']),
  incomeYear: z.number(),
  incomeBase: z.number(),
  assetBase: z.number(),
  loanBalance: z.number(),
  paidInterest: z.number(),
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
