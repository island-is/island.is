import type { GetChildBenefitData } from '../../../gen/fetch'
import type { AllKeys } from './types'

type ChildBenefitSplitCustody =
  | { splitCustody: false }
  | {
      splitCustody: true
      splitCustodyChildrenOver7?: number
      splitCustodyChildrenUnder7?: number
    }

export type ChildBenefitInput = {
  marriedOrCohabiting: boolean
  incomeYear: number
  incomeBase: number
  numberOfChildren: number
  numberOfChildrenUnder7: number
} & ChildBenefitSplitCustody

export type ChildBenefitKey = AllKeys<ChildBenefitInput>

export const toChildBenefitQuery = (
  input: ChildBenefitInput,
): GetChildBenefitData['query'] => ({
  hjuskaparstada: input.marriedOrCohabiting,
  tekjuar: input.incomeYear,
  tekjustofn: input.incomeBase,
  fjoldiBarna: input.numberOfChildren,
  fjoldiBarnaUndir7ara: input.numberOfChildrenUnder7,
  skiptBuseta: input.splitCustody,
  skiptBornYfir7ara: input.splitCustody
    ? input.splitCustodyChildrenOver7
    : undefined,
  skiptBornUndir7ara: input.splitCustody
    ? input.splitCustodyChildrenUnder7
    : undefined,
})
