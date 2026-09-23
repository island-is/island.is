import type { GetChildBenefitData } from '../../../../gen/fetch'
import type { ChildBenefitInput } from './definition'

export const toChildBenefitQuery = (
  input: ChildBenefitInput,
): GetChildBenefitData['query'] => {
  if (
    input.splitCustody &&
    (input.splitCustodyChildrenOver7 == null ||
      input.splitCustodyChildrenUnder7 == null)
  ) {
    throw new Error(
      'splitCustodyChildrenOver7 and splitCustodyChildrenUnder7 are required when splitCustody is true',
    )
  }

  return {
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
  }
}
