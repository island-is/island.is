import { getValueViaPath, resolveFieldId } from '@island.is/application/core'
import {
  Application,
  FieldTypes,
  FormItemTypes,
} from '@island.is/application/types'
import type { BffUser } from '@island.is/shared/types'
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
  application: Application,
  checkIfPartlyAnswered = false,
  user?: BffUser | null,
): boolean => {
  if (!screenRequiresAnswer(screen)) {
    return true
  }

  // An id can depend on the application and the user, so it is resolved first.
  const resolvedId = screen.id
    ? resolveFieldId({ id: screen.id }, application, user ?? undefined)
    : undefined

  if (!resolvedId) {
    return false
  }

  const answer = getValueViaPath(application.answers, resolvedId)
  const answerHasValue = !answerIsMissing(answer)

  if (screen.type === FormItemTypes.REPEATER) {
    return isArray(answer) && (answer as unknown[]).length > 0
  } else if (screen.type === FormItemTypes.MULTI_FIELD) {
    let numberOfAnswers = 0
    let numberOfRequiredAnswers = 0

    for (const subScreen of screen.children) {
      const requiresAnswer = screenRequiresAnswer(subScreen)
      const hasBeenAnswered = screenHasBeenAnswered(
        subScreen,
        application,
        false,
        user,
      )

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
        const childAnswer = getValueViaPath(application.answers, childInputId)
        return answerIsMissing(childAnswer)
      },
    )

    return !hasAnyMissingAnswer
  }

  return answerHasValue
}
