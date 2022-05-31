import { ApplicationContext } from '@island.is/application/core'

import { YES, NO } from '../constants'
import { requiresOtherParentApproval } from '../lib/parentalLeaveUtils'

export function hasEmployer(context: ApplicationContext) {
  const currentApplicationAnswers = context.application.answers as {
    employer: { isSelfEmployed: typeof YES | typeof NO }
  }

  return currentApplicationAnswers.employer.isSelfEmployed === NO && startDateInTheFuture(context)
}

export function needsOtherParentApproval(context: ApplicationContext) {
  return requiresOtherParentApproval(
    context.application.answers,
    context.application.externalData,
  ) && startDateInTheFuture(context)
}

export function startDateInTheFuture(context: ApplicationContext) {
  const currentApplicationAnswers = context.application.answers as {
    periods: [{startDate: string}]
  }
  return new Date(currentApplicationAnswers.periods[0].startDate).getTime() > new Date().getTime()
}
