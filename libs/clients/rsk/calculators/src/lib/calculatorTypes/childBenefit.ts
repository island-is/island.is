import { z } from 'zod'

import type { GetChildBenefitData } from '../../../gen/fetch'
import { count, currency, year } from './semantics'
import type { AllKeys } from './types'

const childBenefitBaseFields = {
  marriedOrCohabiting: z.boolean(),
  incomeYear: year(),
  incomeBase: currency(),
  numberOfChildren: count(),
  numberOfChildrenUnder7: count(),
}

export const childBenefitInputSchema = z.discriminatedUnion('splitCustody', [
  z.object({ ...childBenefitBaseFields, splitCustody: z.literal(false) }),
  z.object({
    ...childBenefitBaseFields,
    splitCustody: z.literal(true),
    splitCustodyChildrenOver7: count().optional(),
    splitCustodyChildrenUnder7: count().optional(),
  }),
])

export type ChildBenefitInput = z.infer<typeof childBenefitInputSchema>

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
