import type { ChildBenefitInput } from '@island.is/clients/rsk/calculators'

import type { SubmittedValues } from '../../submission/submission'
import { numberAt, requireBooleanAt, requireNumberAt } from '../validation'

export const toChildBenefitInput = (
  values: SubmittedValues,
): ChildBenefitInput => ({
  marriedOrCohabiting: requireBooleanAt(values, 'marriedOrCohabiting'),
  incomeYear: requireNumberAt(values, 'incomeYear'),
  incomeBase: requireNumberAt(values, 'incomeBase'),
  numberOfChildren: requireNumberAt(values, 'numberOfChildren'),
  numberOfChildrenUnder7: requireNumberAt(values, 'numberOfChildrenUnder7'),
  splitCustody: requireBooleanAt(values, 'splitCustody'),
  splitCustodyChildrenOver7: numberAt(values, 'splitCustodyChildrenOver7'),
  splitCustodyChildrenUnder7: numberAt(values, 'splitCustodyChildrenUnder7'),
})
