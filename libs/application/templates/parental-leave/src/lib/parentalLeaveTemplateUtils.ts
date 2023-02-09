import { ApplicationContext } from '@island.is/application/types'

import {
  YES,
  NO,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  States,
} from '../constants'
import { requiresOtherParentApproval } from '../lib/parentalLeaveUtils'
import { EmployerRow } from '../types'
import { getValueViaPath } from '@island.is/application/core'

export function allEmployersHaveApproved(context: ApplicationContext) {
  const employers = getValueViaPath<EmployerRow[]>(
    context.application.answers,
    'employers',
  )
  if (!employers) {
    return false
  }
  return employers.every((e) => !!e.isApproved)
}

export function hasEmployer(context: ApplicationContext) {
  const currentApplicationAnswers = context.application.answers as {
    isReceivingUnemploymentBenefits: typeof YES | typeof NO
    applicationType: {
      option:
        | typeof PARENTAL_LEAVE
        | typeof PARENTAL_GRANT
        | typeof PARENTAL_GRANT_STUDENTS
    }
    isSelfEmployed: typeof YES | typeof NO
  }
  const oldApplicationAnswers = context.application.answers as {
    isRecivingUnemploymentBenefits: typeof YES | typeof NO
    employer: {
      isSelfEmployed: typeof YES | typeof NO
    }
  }

  const isUndifinedReceivingUnemploymentBenefits =
    currentApplicationAnswers.isReceivingUnemploymentBenefits !== undefined ||
    oldApplicationAnswers.isRecivingUnemploymentBenefits !== undefined
  const receivingUnemploymentBenefits =
    currentApplicationAnswers.isReceivingUnemploymentBenefits === NO ||
    oldApplicationAnswers.isRecivingUnemploymentBenefits === NO
  const selfEmployed =
    currentApplicationAnswers.isSelfEmployed === NO ||
    oldApplicationAnswers.employer?.isSelfEmployed === NO

  // Added this check for applications that is in the db already so they can go through to next state
  if (currentApplicationAnswers.applicationType === undefined) {
    if (isUndifinedReceivingUnemploymentBenefits) {
      return selfEmployed && receivingUnemploymentBenefits
    }

    return selfEmployed
  } else
    return currentApplicationAnswers.applicationType.option === PARENTAL_LEAVE
      ? selfEmployed && receivingUnemploymentBenefits
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

export function findActionName(context: ApplicationContext) {
  const { application } = context
  const { state } = application
  if (state === States.ADDITIONAL_DOCUMENTS_REQUIRED) return 'document'
  if (state === States.EDIT_OR_ADD_PERIODS) return 'period'

  return 'period' // Have default on period so we always reset actionName
}
