import type { ChildBenefitInput } from '@island.is/clients/rsk/calculators'
import { Hjuskaparstada } from '@island.is/clients/rsk/calculators'

import type { SubmittedValues } from '../../submission/submission'
import { numberAt, requireNumberAt, requireOptionAt } from '../validation'

export const toChildBenefitInput = (
  values: SubmittedValues,
): ChildBenefitInput => ({
  hjuskaparstada: requireOptionAt(
    values,
    'hjuskaparstada',
    Object.values(Hjuskaparstada),
  ),
  tekjuar: requireNumberAt(values, 'tekjuar'),
  tekjustofn: requireNumberAt(values, 'tekjustofn'),
  fjoldiBarna: requireNumberAt(values, 'fjoldiBarna'),
  fjoldiBarnaUndir7ara: numberAt(values, 'fjoldiBarnaUndir7ara'),
  skiptBornYfir7ara: numberAt(values, 'skiptBornYfir7ara'),
  skiptBornUndir7ara: numberAt(values, 'skiptBornUndir7ara'),
})
