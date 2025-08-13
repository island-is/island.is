import { getValueViaPath, NO, YES, YesOrNo } from '@island.is/application/core'
import { ApplicationContext } from '@island.is/application/types'
import {
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  States,
} from '../constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  requiresOtherParentApproval,
  residentGrantIsOpenForApplication,
} from '../lib/parentalLeaveUtils'
import { EmployerRow, Period } from '../types'

export const allEmployersHaveApproved = (context: ApplicationContext) => {
  const employers = getValueViaPath<EmployerRow[]>(
    context.application.answers,
    'employers',
  )
  if (!employers) {
    return false
  }

  // We need to check if the employer has opened the application (has a value in 'reviewerNationalRegistryId')
  // because it is not recorded if the employer has approved the application until after this check
  // Employer does not need to approve application if "stillEmployed" is NO
  return employers.every(
    (e) => !!e.reviewerNationalRegistryId || e.stillEmployed === NO,
  )
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

export const restructureVMSTPeriods = (context: ApplicationContext) => {
  const { application } = context
  const { VMSTPeriods } = getApplicationExternalData(application.externalData)
  const { periods } = getApplicationAnswers(application.answers)

  const today = new Date()
  const newPeriods: Period[] = []
  VMSTPeriods?.forEach((period, index) => {
    /*
     ** VMST could change startDate but still return 'date_of_birth'
     ** Make sure if period is in the past then we use the date they sent
     */
    let firstPeriodStart =
      period.firstPeriodStart === 'date_of_birth'
        ? 'actualDateOfBirth'
        : 'specificDate'
    if (new Date(period.from).getTime() <= today.getTime()) {
      firstPeriodStart = 'specificDate'
    }

    let useLength = NO
    if (firstPeriodStart === 'actualDateOfBirth') {
      useLength = periods[0].useLength ?? NO
    }

    const rightsCodePeriod = period.rightsCodePeriod.split(',')[0]
    const obj = {
      startDate: period.from,
      endDate: period.to,
      ratio: period.ratio.split(',')[0],
      rawIndex: index,
      firstPeriodStart: firstPeriodStart,
      useLength: useLength as YesOrNo,
      rightCodePeriod: rightsCodePeriod,
      daysToUse: period.days,
      paid: period.paid,
      approved: period.approved,
    }
    newPeriods.push(obj)
  })

  return newPeriods
}
