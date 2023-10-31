import {
  AllOrAny,
  Answer,
  Comparators,
  DataProviderResult,
  ExternalData,
  FormItem,
  FormValue,
  SingleConditionCheck,
  StaticCheck,
} from '@island.is/application/types'
import { getValueViaPath } from './formUtils'

function applyStaticConditionalCheck(
  formValue: FormValue,
  externalData: ExternalData,
  check: StaticCheck,
): boolean {
  const { value, questionId, comparator, externalDataId } = check
  let isValid = false
  let answer
  if (questionId) {
    answer = getValueViaPath(formValue, questionId) as Answer
  } else if (externalDataId) {
    answer = getValueViaPath(externalData, externalDataId) as Answer
  }
  switch (comparator) {
    case Comparators.EQUALS:
      isValid = answer === value
      break
    case Comparators.NOT_EQUAL:
      isValid = answer !== value
      break
    case Comparators.GT:
      if (answer) {
        isValid = answer > value
      }
      break
    case Comparators.GTE:
      if (answer) {
        isValid = answer >= value
      }
      break
    case Comparators.LT:
      if (answer) {
        isValid = answer < value
      }
      break
    case Comparators.LTE:
      if (answer) {
        isValid = answer <= value
      }
      break
    case Comparators.CONTAINS:
      if (answer && Array.isArray(answer)) {
        isValid = answer.includes(value)
      }
      break
    case Comparators.NOT_CONTAINS:
      if (answer && Array.isArray(answer)) {
        isValid = !answer.includes(value)
      }
      break
  }
  return isValid
}

export function shouldShowFormItem(
  formItem: FormItem,
  formValue: FormValue,
  externalData: ExternalData = {},
): boolean {
  const { condition } = formItem
  if (!condition) {
    return true
  }

  if (typeof condition === 'function') {
    return condition(formValue, externalData)
  }

  if (condition.isMultiCheck) {
    const { show, check, on } = condition

    for (let i = 0; i < check.length; i++) {
      const conditionalCheck: SingleConditionCheck = check[i]
      let isValid: boolean
      if (typeof conditionalCheck === 'function') {
        isValid = conditionalCheck(formValue, externalData)
      } else {
        isValid = applyStaticConditionalCheck(
          formValue,
          externalData,
          conditionalCheck,
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
  )
}
