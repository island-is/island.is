import { ApplicationContext } from '@island.is/application/types'

import {
  YES,
  NO,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
} from '../constants'
import { requiresOtherParentApproval } from '../lib/parentalLeaveUtils'

export function hasEmployer(context: ApplicationContext) {
  const currentApplicationAnswers = context.application.answers as {
    isRecivingUnemploymentBenefits: typeof YES | typeof NO
    applicationType: {
      option:
        | typeof PARENTAL_LEAVE
        | typeof PARENTAL_GRANT
        | typeof PARENTAL_GRANT_STUDENTS
    }
    employer: { isSelfEmployed: typeof YES | typeof NO }
  }

  console.log('current: ', currentApplicationAnswers)

  // Added this check for applications that is in the db already so they can go through to next state
  if (currentApplicationAnswers.applicationType === undefined) {
    if (
      currentApplicationAnswers.isRecivingUnemploymentBenefits !== undefined
    ) {
      return (
        currentApplicationAnswers.employer.isSelfEmployed === NO &&
        currentApplicationAnswers.isRecivingUnemploymentBenefits === NO
      )
    }

    return currentApplicationAnswers.employer.isSelfEmployed === NO
  } else
    return currentApplicationAnswers.applicationType.option === PARENTAL_LEAVE
      ? currentApplicationAnswers.employer.isSelfEmployed === NO &&
          currentApplicationAnswers.isRecivingUnemploymentBenefits === NO
      : false
}

export function needsOtherParentApproval(context: ApplicationContext) {
  return requiresOtherParentApproval(
    context.application.answers,
    context.application.externalData,
  )
}

export function currentDateStartTime() {
  const date = new Date().toDateString()
  return new Date(date).getTime()
}
