import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { Application, ApplicationContext } from '@island.is/application/types'
import {
  ApplicationAction,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  States,
} from '../constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getChangeBaseline,
  normalize,
  requiresOtherParentApproval,
  requiresOtherParentApprovalForEdits,
  residentGrantIsOpenForApplication,
  vmstFirstPeriodStartToAnswer,
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

const EDIT_FLOW_REVIEW_STATES: string[] = [
  States.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
  States.EMPLOYER_APPROVE_EDITS,
  States.VINNUMALASTOFNUN_APPROVE_EDITS,
]

/**
 * What the applicant is told before taking an application back from review.
 *
 * A first-time application goes back to DRAFT. On resubmit every approval is
 * asked for again, because `clearEmployers` resets employer approvals. In the
 * edit flow, only the parties the new changes concern review them again, and
 * that is not known until the applicant has made them.
 */
export const getReapprovalAfterEdit = (application: Application) => {
  if (EDIT_FLOW_REVIEW_STATES.includes(application.state)) {
    return { isEditFlow: true, otherParent: false, employer: false }
  }

  const context = { application } as ApplicationContext
  return {
    isEditFlow: false,
    otherParent: needsOtherParentApproval(context),
    employer: hasEmployer(context),
  }
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
 * True once VMST has a record of this application: its own `sendApplication`
 * returned an id, or `setApplicationFundId` stored one for a first-time
 * application. Used to hide the delete button from states like DRAFT that can
 * be re-entered after VMST approval — once VMST has the application, deleting
 * it from our side would leave the two systems out of sync.
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
  if (sendApplicationId) {
    return true
  }

  // A change application inherits its predecessor's fund id into `navId` before
  // its own `sendApplication` runs. That id is not evidence VMST has this row.
  const { applicationAction } = getApplicationAnswers(application.answers)
  if (applicationAction === ApplicationAction.CHANGE) {
    return false
  }

  return Boolean(
    (typeof navIdData === 'string' && navIdData) ||
      (typeof rawNavId === 'string' && rawNavId),
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
    const rightsCodePeriod = (period.rightsCodePeriod ?? '').split(',')[0]
    const obj = {
      startDate: period.from,
      endDate: period.to,
      ratio: period.ratio.split(',')[0],
      rawIndex: index,
      firstPeriodStart: vmstFirstPeriodStartToAnswer(period),
      rightCodePeriod: rightsCodePeriod,
      daysToUse: period.days ?? undefined,
      paid: period.paid,
      approved: period.approved,
    }
    newPeriods.push(obj)
  })

  return newPeriods
}
