import type { GetInterestBenefitData } from '../../../../gen/fetch'
import type { InterestBenefitInput } from './contract'

const RSK_VALUE_BY_MARITAL_STATUS: Record<
  InterestBenefitInput['maritalStatus'],
  number
> = {
  single: 1,
  singleParent: 2,
  marriedOrCohabiting: 3,
}

export const toInterestBenefitQuery = (
  input: InterestBenefitInput,
): GetInterestBenefitData['query'] => ({
  hjuskaparstada: RSK_VALUE_BY_MARITAL_STATUS[input.maritalStatus],
  tekjuar: input.incomeYear,
  tekjustofn: input.incomeBase,
  eignastofn: input.assetBase,
  eftirstodvar: input.loanBalance,
  greiddVaxtagjold: input.paidInterest,
})
