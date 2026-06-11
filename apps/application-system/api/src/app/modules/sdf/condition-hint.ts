import {
  Condition,
  StaticCheck,
  Comparators,
} from '@island.is/application/types'
import { SdfComparators } from '@island.is/application/sdf-types'
import {
  SingleClientConditionDto,
  MultiClientConditionDto,
} from './dto/screen.dto'

type ClientCondition = SingleClientConditionDto | MultiClientConditionDto

export const extractClientCondition = (
  condition?: Condition,
): ClientCondition | null => {
  if (!condition) return null
  if (typeof condition === 'function') return null

  if (condition.isMultiCheck) {
    if (condition.check.some((c) => typeof c === 'function')) return null
    return {
      type: 'multi' as const,
      on: condition.on as 'all' | 'any',
      checks: (condition.check as StaticCheck[]).map(staticCheckToHint),
    }
  }

  return staticCheckToHint(condition as StaticCheck)
}

const staticCheckToHint = (check: StaticCheck): SingleClientConditionDto => {
  return {
    questionId:
      check.questionId ?? check.externalDataId ?? check.userPropId ?? '',
    comparator:
      SdfComparators[check.comparator as Comparators] ?? check.comparator,
    value: String(check.value),
  }
}
