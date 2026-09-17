import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { Application, ApplicationContext } from '@island.is/application/types'
import {
  ApplicationAction,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
} from '../constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getChangeBaseline,
  normalize,
  requiresOtherParentApproval,
  requiresOtherParentApprovalForEdits,
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

export const needsOtherParentApprovalForEdits = (
  context: ApplicationContext,
) => {
  return requiresOtherParentApprovalForEdits(
    context.application.answers,
    context.application.externalData,
  )
}

export const hasEmployerRelevantChange = (context: ApplicationContext) => {
  if (!hasEmployer(context)) {
    return false
  }

  const { application } = context
  const baseline = getChangeBaseline(application.externalData)

  if (!baseline) {
    return true
  }

  const { employers, isSelfEmployed, periods } = getApplicationAnswers(
    application.answers,
  )

  const employersChanged =
    isSelfEmployed !== YES &&
    JSON.stringify(employers) !== JSON.stringify(baseline.employers)
  const selfEmployedChanged =
    normalize(baseline.employment.isSelfEmployed) !== normalize(isSelfEmployed)
  const periodsChanged =
    JSON.stringify(periods) !== JSON.stringify(baseline.periods)

  return employersChanged || selfEmployedChanged || periodsChanged
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

/**
 * True when this application was created to change an already submitted one.
 * Drives the prerequisites routing straight into the change form instead of the
 * full draft form.
 */
export const isChangeApplication = (context: ApplicationContext) => {
  const { applicationAction } = getApplicationAnswers(
    context.application.answers,
  )
  return applicationAction === ApplicationAction.CHANGE
}

/**
 * True once VMST has a record of the application (either a fund id was returned
 * from `sendApplication` / `setApplicationFundId`, or the application was
 * created as a change of an already-submitted one). Used to hide the delete
 * button from states like DRAFT that can be re-entered after VMST approval —
 * once VMST has the application, deleting it from our side would leave the
 * two systems out of sync.
 */
export const hasBeenSubmittedToVMST = (application: Application) => {
  const navIdData = getValueViaPath<string>(
    application.externalData,
    'navId.data',
  )
  const rawNavId = getValueViaPath<string>(application.externalData, 'navId')
  const sendApplicationId = getValueViaPath<string>(
    application.externalData,
    'sendApplication.data.id',
  )
  return Boolean(
    (typeof navIdData === 'string' && navIdData) ||
      (typeof rawNavId === 'string' && rawNavId) ||
      sendApplicationId,
  )
}

export const isInPlaceRewind = (context: ApplicationContext) =>
  getValueViaPath<boolean>(
    context.application.externalData,
    'inPlaceRewind.data.value',
  ) === true

/** True when this application was created to apply for the residence grant. */
export const isResidenceGrantApplication = (context: ApplicationContext) => {
  const { applicationAction } = getApplicationAnswers(
    context.application.answers,
  )
  return applicationAction === ApplicationAction.RESIDENCE_GRANT
}

/** True when the application uses mock data and should bypass VMST approval. */
export const isMockApplication = (context: ApplicationContext) => {
  return (
    getValueViaPath(context.application.answers, 'mock.useMockData') === YES &&
    !isChangeApplication(context)
  )
}

export const restructureVMSTPeriods = (
  externalData: Application['externalData'],
): Period[] => {
  const { VMSTPeriods } = getApplicationExternalData(externalData)

  const newPeriods: Period[] = []
  VMSTPeriods?.forEach((period, index) => {
    const rightsCodePeriod = period.rightsCodePeriod.split(',')[0]
    const obj = {
      startDate: period.from,
      endDate: period.to,
      ratio: period.ratio.split(',')[0],
      rawIndex: index,
      rightCodePeriod: rightsCodePeriod,
      daysToUse: period.days,
      paid: period.paid,
      approved: period.approved,
    }
    newPeriods.push(obj)
  })

  return newPeriods
}
