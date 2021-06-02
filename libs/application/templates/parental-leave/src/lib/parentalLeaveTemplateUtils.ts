import {
  ApplicationContext,
  getValueViaPath,
} from '@island.is/application/core'

import { YES, NO } from '../constants'
import { Boolean } from '../types'

export function hasEmployer(context: ApplicationContext) {
  const currentApplicationAnswers = context.application.answers as {
    employer: { isSelfEmployed: typeof YES | typeof NO }
  }

  return currentApplicationAnswers.employer.isSelfEmployed === NO
}

export function needsOtherParentApproval(context: ApplicationContext) {
  const { application } = context
  const { answers } = application
  const isRequestingRights = getValueViaPath(
    answers,
    'requestRights.isRequestingRights',
  ) as Boolean
  const usePersonalAllowanceFromSpouse = getValueViaPath(
    answers,
    'usePersonalAllowanceFromSpouse',
  ) as Boolean

  return isRequestingRights === YES || usePersonalAllowanceFromSpouse === YES
}
