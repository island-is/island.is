import {
  AllOrAny,
  Answer,
  Comparators,
  ExternalData,
  FormItem,
  FormValue,
  SingleConditionCheck,
  StaticCheck,
} from '@island.is/application/types'
import { getValueViaPath } from './formUtils'
import { User } from 'user'

function applyStaticConditionalCheck(
  formValue: FormValue,
  externalData: ExternalData,
  check: StaticCheck,
  user: User | null,
): boolean {
  const { value, questionId, comparator, externalDataId, userPropId } = check
  let isValid = false
  let valueViaPath
  if (questionId) {
    valueViaPath = getValueViaPath(formValue, questionId) as Answer
  } else if (externalDataId) {
    valueViaPath = getValueViaPath(externalData, externalDataId) as Answer
  } else if (userPropId && user) {
    valueViaPath = getValueViaPath(user, userPropId) as Answer
  }
  switch (comparator) {
    case Comparators.EQUALS:
      isValid = valueViaPath === value
      break
    case Comparators.NOT_EQUAL:
      isValid = valueViaPath !== value
      break
    case Comparators.GT:
      if (valueViaPath) {
        isValid = valueViaPath > value
      }
      break
    case Comparators.GTE:
      if (valueViaPath) {
        isValid = valueViaPath >= value
      }
      break
    case Comparators.LT:
      if (valueViaPath) {
        isValid = valueViaPath < value
      }
      break
    case Comparators.LTE:
      if (valueViaPath) {
        isValid = valueViaPath <= value
      }
      break
    case Comparators.CONTAINS:
      if (valueViaPath && Array.isArray(valueViaPath)) {
        isValid = valueViaPath.includes(value)
      }
      break
    case Comparators.NOT_CONTAINS:
      if (valueViaPath && Array.isArray(valueViaPath)) {
        isValid = !valueViaPath.includes(value)
      }
      break
  }
  return isValid
}

export function shouldShowFormItem(
  formItem: FormItem,
  formValue: FormValue,
  externalData: ExternalData = {},
  user: User | null,
): boolean {
  const { condition } = formItem
  if (!condition) {
    return true
  }

  if (typeof condition === 'function') {
    return condition(formValue, externalData, user)
  }

  if (condition.isMultiCheck) {
    const { show, check, on } = condition

    for (let i = 0; i < check.length; i++) {
      const conditionalCheck: SingleConditionCheck = check[i]
      let isValid: boolean
      if (typeof conditionalCheck === 'function') {
        isValid = conditionalCheck(formValue, externalData, user)
      } else {
        isValid = applyStaticConditionalCheck(
          formValue,
          externalData,
          conditionalCheck,
          user,
        )
      }

      if (on === AllOrAny.ALL) {
        if (!isValid) {
          return !show
        }
      } else if (isValid) {
        return show
      }
    }
    return on === AllOrAny.ALL ? show : !show
  }

  return applyStaticConditionalCheck(
    formValue,
    externalData,
    condition as StaticCheck,
    user,
  )
}
