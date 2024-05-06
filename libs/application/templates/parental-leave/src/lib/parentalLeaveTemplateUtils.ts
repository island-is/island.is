import { ApplicationContext } from '@island.is/application/types'

import { getValueViaPath } from '@island.is/application/core'
import {
  NO,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  States,
  YES,
} from '../constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  requiresOtherParentApproval,
  residentGrantIsOpenForApplication,
} from '../lib/parentalLeaveUtils'
import { EmployerRow } from '../types'

export const allEmployersHaveApproved = (context: ApplicationContext) => {
  const employers = getValueViaPath<EmployerRow[]>(
    context.application.answers,
    'employers',
  )
  if (!employers) {
    return false
  }
  return employers.every((e) => !!e.isApproved)
}

export const hasEmployer = (context: ApplicationContext) => {
  const { application } = context
  const { isReceivingUnemploymentBenefits, isSelfEmployed, employers } =
    getApplicationAnswers(application.answers)

  const applicationType = (
    application.answers as {
      applicationType: { option: string }
    }
  )?.applicationType

  // Added this check for applications that is in the db already so they can go through to next state
  if (applicationType === undefined) {
    if (isReceivingUnemploymentBenefits !== undefined) {
      return isSelfEmployed === NO && isReceivingUnemploymentBenefits === NO
    }
    return isSelfEmployed === NO
  } else {
    if (applicationType.option === PARENTAL_LEAVE) {
      return isSelfEmployed === NO && isReceivingUnemploymentBenefits === NO
    } else if (
      (applicationType.option === PARENTAL_GRANT ||
        applicationType.option === PARENTAL_GRANT_STUDENTS) &&
      employers !== undefined
    ) {
      return employers.some((employer) => employer.stillEmployed === YES)
    } else {
      return false
    }
  }
}

export const needsOtherParentApproval = (context: ApplicationContext) => {
  return requiresOtherParentApproval(
    context.application.answers,
    context.application.externalData,
  )
}

export const currentDateStartTime = () => {
  const date = new Date().toDateString()
  return new Date(date).getTime()
}

export const disableResidenceGrantApplication = (dateOfBirth: string) => {
  if (!residentGrantIsOpenForApplication(dateOfBirth)) return false
  return true
}

export const hasDateOfBirth = (context: ApplicationContext) => {
  const { application } = context
  const { dateOfBirth } = getApplicationExternalData(application.externalData)
  return disableResidenceGrantApplication(dateOfBirth?.data?.dateOfBirth || '')
}

export const goToState = (
  applicationContext: ApplicationContext,
  state: States,
) => {
  const { previousState } = getApplicationAnswers(
    applicationContext.application.answers,
  )
  if (previousState === state) return true
  return false
}
