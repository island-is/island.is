import { ApplicationContext } from '@island.is/application/types'

import {
  YES,
  NO,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  States,
  FileType,
} from '../constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  requiresOtherParentApproval,
  residentGrantIsOpenForApplication,
} from '../lib/parentalLeaveUtils'
import { EmployerRow, Period, YesOrNo } from '../types'
import { getValueViaPath } from '@island.is/application/core'
import set from 'lodash/set'

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

export const findActionName = (context: ApplicationContext) => {
  const { application } = context
  const { state } = application
  const {
    addEmployer,
    addPeriods,
    changeEmployerFile,
    changeEmployer,
    changePeriods,
  } = getApplicationAnswers(application.answers)

  if (
    state === States.RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE ||
    state === States.RESIDENCE_GRANT_APPLICATION
  )
    return 'documentPeriod'
  if (state === States.ADDITIONAL_DOCUMENTS_REQUIRED) return 'document'

  if (state === States.EDIT_OR_ADD_EMPLOYERS_AND_PERIODS) {
    let tmpChangePeriods = changePeriods
    let tmpChangeEmployer = changeEmployer

    if (addEmployer === YES && addPeriods === YES) {
      tmpChangeEmployer = true
      tmpChangePeriods = true

      // Keep book keeping of what has been selected
      if (!changeEmployer) {
        set(application.answers, 'changeEmployer', true)
      }
      if (!changePeriods) {
        set(application.answers, 'changePeriods', true)
      }
    }

    if (addEmployer === YES) {
      tmpChangeEmployer = true

      // Keep book keeping of what has been selected
      if (!changeEmployer) {
        set(application.answers, 'changeEmployer', true)
      }
    }
    if (addPeriods === YES) {
      tmpChangePeriods = true

      // Keep book keeping of what has been selected
      if (!changePeriods) {
        set(application.answers, 'changePeriods', true)
      }
    }

    // If the applicant has selected add employee and/or period at some point
    if (changeEmployerFile && tmpChangeEmployer && tmpChangePeriods) {
      return FileType.EMPDOCPER
    } else if (changeEmployerFile && tmpChangeEmployer) {
      return FileType.EMPDOC
    }
    if (tmpChangeEmployer && tmpChangePeriods) {
      return FileType.EMPPER
    } else if (tmpChangeEmployer) {
      return FileType.EMPLOYER
    } else if (tmpChangePeriods) {
      return FileType.PERIOD
    }
  }

  return undefined
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

    if (!period.rightsCodePeriod.includes('DVAL')) {
      // API returns multiple rightsCodePeriod in string ('M-L-GR, M-FS')
      const rightsCodePeriod = period.rightsCodePeriod.split(',')[0]
      const obj = {
        startDate: period.from,
        endDate: period.to,
        ratio: period.ratio.split(',')[0],
        rawIndex: index,
        firstPeriodStart: firstPeriodStart,
        useLength: NO as YesOrNo, // TODO: Passa þetta?? (ef fer inn í EDIT stöðu áður en búið að vinna með tímabil, á að haldast sem "yes"?)
        rightCodePeriod: rightsCodePeriod,
        daysToUse: period.days, // TODO: Getur verið að er ekki með days? (þarf að gera ehv svo gamalt "daysToUse" haldist ekki inni)
        paid: period.paid,
        approved: period.approved,
      }
      newPeriods.push(obj)
    }
  })

  return newPeriods
}
