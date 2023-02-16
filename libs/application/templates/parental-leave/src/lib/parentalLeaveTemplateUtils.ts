import { ApplicationContext, DefaultEvents } from '@island.is/application/types'

import {
  YES,
  NO,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  States,
} from '../constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  requiresOtherParentApproval,
} from '../lib/parentalLeaveUtils'
import { disableResidenceGrantApplication } from './answerValidationSections/utils'

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

export function findActionName(context: ApplicationContext) {
  const { application } = context
  const { state } = application
  if (
    state === States.RESIDENCE_GRAND_APPLICATION_NO_BIRTH_DATE ||
    state === States.RESIDENCE_GRAND_APPLICATION
  )
    return 'documentPeriod'
  if (state === States.ADDITIONAL_DOCUMENTS_REQUIRED) return 'document'
  if (state === States.EDIT_OR_ADD_PERIODS) return 'period'

  return 'period' // Have default on period so we always reset actionName
}

export function hasDateOfBirth(context: ApplicationContext) {
  const { application } = context
  const { dateOfBirth } = getApplicationExternalData(application.externalData)
  return disableResidenceGrantApplication(dateOfBirth?.data?.dateOfBirth || '')
}

export function previousStateApproved(context: ApplicationContext) {
  const { application } = context
  const { previousState } = getApplicationAnswers(application.answers)
  return previousState === 'approved'
}
export function previousStateVinnumalastofnunApproval(
  context: ApplicationContext,
) {
  const { application } = context
  const { previousState } = getApplicationAnswers(application.answers)
  return previousState === 'vinnumalastofnunApproval'
}
