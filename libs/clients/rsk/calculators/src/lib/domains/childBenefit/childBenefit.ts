import type { GetChildBenefitData } from '../../../../gen/fetch'
import type { ChildBenefitInput } from './contract'

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
