import { getValueViaPath } from '@island.is/application/core'
import {
  FieldTypes,
  FormItemTypes,
  FormValue,
} from '@island.is/application/types'
import get from 'lodash/get'
import isArray from 'lodash/isArray'

import { FormScreen } from './types'

export const answerIsMissing = (answer: unknown) => {
  return answer === undefined
}

export const screenRequiresAnswer = (screen: FormScreen): boolean => {
  if (!screen.isNavigable) {
    return false
  }

  if (screen.type === FormItemTypes.REPEATER) {
    return true
  } else if (screen.type === FormItemTypes.MULTI_FIELD) {
    let screensThatRequireAnswer = 0

    for (const subScreen of screen.children) {
      if (screenRequiresAnswer(subScreen)) {
        screensThatRequireAnswer += 1
      }
    }

    return screensThatRequireAnswer > 0
  }

  const doesNotRequireAnswer = get(screen, 'doesNotRequireAnswer') === true
  return !doesNotRequireAnswer
}

export const screenHasBeenAnswered = (
  screen: FormScreen,
  answers: FormValue,
  checkIfPartlyAnswered = false,
): boolean => {
  if (!screenRequiresAnswer(screen)) {
    return true
  }

  if (!screen.id) {
    return false
  }

  const answer = getValueViaPath(answers, screen.id)
  const answerHasValue = !answerIsMissing(answer)

  if (screen.type === FormItemTypes.REPEATER) {
    return isArray(answer) && (answer as unknown[]).length > 0
  } else if (screen.type === FormItemTypes.MULTI_FIELD) {
    let numberOfAnswers = 0
    let numberOfRequiredAnswers = 0

    for (const subScreen of screen.children) {
      const requiresAnswer = screenRequiresAnswer(subScreen)
      const hasBeenAnswered = screenHasBeenAnswered(subScreen, answers)

      if (requiresAnswer) {
        numberOfRequiredAnswers += 1

        if (hasBeenAnswered) {
          numberOfAnswers += 1
        }
      }
    }

    if (checkIfPartlyAnswered) {
      return numberOfAnswers > 0
    }

    return numberOfAnswers === numberOfRequiredAnswers
  } else if (
    screen.type === FieldTypes.CUSTOM &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (screen as any).childInputIds &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (screen as any).childInputIds.length > 0
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasAnyMissingAnswer = (screen as any).childInputIds.some(
      (childInputId: string) => {
        const childAnswer = getValueViaPath(answers, childInputId)
        return answerIsMissing(childAnswer)
      },
    )

    return !hasAnyMissingAnswer
  }

  return answerHasValue
}
