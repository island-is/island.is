import { FormLeaf } from '../types/Form'
import { Answer, FormValue } from '../types/Application'
import {
  AllOrAny,
  Comparators,
  SingleConditionCheck,
  StaticCheck,
} from '../types/Condition'

const getValueViaPath = (
  obj: {},
  path: string,
  defaultValue = undefined,
): Answer | undefined => {
  try {
    const travel = (regexp: RegExp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce(
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          (res, key) => (res !== null && res !== undefined ? res[key] : res),
          obj,
        )
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
    return result === undefined || result === obj ? defaultValue : result
  } catch (e) {
    return undefined
  }
}

function applyStaticConditionalCheck(
  formValue: FormValue,
  check: StaticCheck,
): boolean {
  const { value, questionId, comparator } = check
  let isValid = false
  const answer = getValueViaPath(formValue, questionId)
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
  }
  return isValid
}

export function shouldShowFormLeaf(
  leaf: FormLeaf,
  formValue: FormValue,
): boolean {
  const { condition } = leaf
  if (!condition) {
    return true
  }

  if (typeof condition === 'function') {
    return condition(formValue)
  }

  if (condition.isMultiCheck) {
    const { show, check, on } = condition

    for (let i = 0; i < check.length; i++) {
      const conditionalCheck: SingleConditionCheck = check[i]
      let isValid: boolean
      if (typeof conditionalCheck === 'function') {
        isValid = conditionalCheck(formValue)
      } else {
        isValid = applyStaticConditionalCheck(formValue, conditionalCheck)
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

  return applyStaticConditionalCheck(formValue, condition as StaticCheck)
}
