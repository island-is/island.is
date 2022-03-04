import { join } from 'path'
import get from 'lodash/get'

import {
  ParentalLeave,
  Period,
  Employer,
  Union,
  PensionFund,
  Attachment,
} from '@island.is/clients/vmst'
import { Application } from '@island.is/application/core'
import {
  getSelectedChild,
  getApplicationAnswers,
  getSpouse,
  ParentalRelations,
  YES,
  Period as AnswerPeriod,
  getApplicationExternalData,
  getOtherParentId,
  applicantIsMale,
} from '@island.is/application/templates/parental-leave'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { apiConstants } from './constants'

export const getPersonalAllowance = (
  application: Application,
  fromSpouse = false,
): number => {
  const {
    usePersonalAllowanceFromSpouse,
    usePersonalAllowance,
    spouseUseAsMuchAsPossible,
    personalUseAsMuchAsPossible,
    personalUsage,
    spouseUsage,
  } = getApplicationAnswers(application.answers)

  const usePersonalAllowanceGetter = fromSpouse
    ? usePersonalAllowanceFromSpouse
    : usePersonalAllowance
  const useMaxGetter = fromSpouse
    ? spouseUseAsMuchAsPossible
    : personalUseAsMuchAsPossible
  const usageGetter = fromSpouse ? spouseUsage : personalUsage

  const willUsePersonalAllowance = usePersonalAllowanceGetter === YES

  if (!willUsePersonalAllowance) {
    return 0
  }

  const willUseMax = useMaxGetter === YES

  if (willUseMax) {
    return 100
  }

  return Number(usageGetter)
}

export const getEmployer = (
  application: Application,
  isSelfEmployed = false,
): Employer => {
  const {
    applicantEmail,
    employerEmail,
    employerNationalRegistryId,
  } = getApplicationAnswers(application.answers)

  return {
    email: isSelfEmployed ? applicantEmail : employerEmail,
    nationalRegistryId: isSelfEmployed
      ? application.applicant
      : employerNationalRegistryId,
  }
}

export const getPensionFund = (
  application: Application,
  isPrivate = false,
): PensionFund => {
  const getter = isPrivate
    ? 'payments.privatePensionFund'
    : 'payments.pensionFund'

  const value = get(application.answers, getter, isPrivate ? null : undefined)

  if (isPrivate) {
    return {
      id:
        typeof value === 'string'
          ? value
          : apiConstants.pensionFunds.noPrivatePensionFundId,
      name: '',
    }
  }

  if (typeof value !== 'string') {
    throw new Error(
      'transformApplicationToParentalLeaveDTO: No pension fund provided.',
    )
  }

  return {
    id: value,
    name: '',
  }
}

export const getPrivatePensionFundRatio = (application: Application) => {
  const { privatePensionFundPercentage } = getApplicationAnswers(
    application.answers,
  )
  const privatePensionFundRatio: number =
    Number(privatePensionFundPercentage) || 0

  return privatePensionFundRatio
}

export const getApplicantContactInfo = (application: Application) => {
  const { userEmail, userPhoneNumber } = getApplicationExternalData(
    application.externalData,
  )
  const { applicantEmail, applicantPhoneNumber } = getApplicationAnswers(
    application.answers,
  )
  const email = applicantEmail || userEmail
  const phoneNumber = applicantPhoneNumber || userPhoneNumber

  if (!email) {
    throw new Error('Missing applicant email')
  }

  if (!phoneNumber) {
    throw new Error('Missing applicant phone number')
  }

  return {
    email: email as string,
    phoneNumber: phoneNumber as string,
  }
}

export const getRightsCode = (application: Application): string => {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  const answers = getApplicationAnswers(application.answers)
  const isSelfEmployed = answers.isSelfEmployed === YES

  if (selectedChild.parentalRelation === ParentalRelations.primary) {
    if (isSelfEmployed) {
      return 'M-S-GR'
    } else {
      return 'M-L-GR'
    }
  }

  const spouse = getSpouse(application)
  const parentsAreInRegisteredCohabitation =
    selectedChild.primaryParentNationalRegistryId === spouse?.nationalId

  const parentPrefix = applicantIsMale(application) ? 'F' : 'FO'

  if (parentsAreInRegisteredCohabitation) {
    // If this secondary parent is in registered cohabitation with primary parent
    // then they will automatically be granted custody
    if (isSelfEmployed) {
      return `${parentPrefix}-S-GR`
    } else {
      return `${parentPrefix}-L-GR`
    }
  }

  if (isSelfEmployed) {
    return `${parentPrefix}-FL-S-GR`
  } else {
    return `${parentPrefix}-FL-L-GR`
  }
}

export const answerToPeriodsDTO = (answers: AnswerPeriod[]) => {
  let periods: Period[] = []

  if (answers) {
    periods = answers.map((period) => ({
      from: period.startDate,
      to: period.endDate,
      ratio: Number(period.ratio),
      approved: false,
      paid: false,
      rightsCodePeriod: null,
    }))
  }

  return periods
}

export const transformApplicationToParentalLeaveDTO = (
  application: Application,
  periods: Period[],
  attachments?: Attachment[],
): ParentalLeave => {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  const { isSelfEmployed, union, bank } = getApplicationAnswers(
    application.answers,
  )
  const { email, phoneNumber } = getApplicantContactInfo(application)
  const selfEmployed = isSelfEmployed === YES

  return {
    applicationId: application.id,
    applicant: application.applicant,
    otherParentId: getOtherParentId(application),
    expectedDateOfBirth: selectedChild.expectedDateOfBirth,
    // TODO: get true date of birth, not expected
    // will get it from a new Þjóðskrá API (returns children in custody of a national registry id)
    dateOfBirth: '',
    email,
    phoneNumber,
    paymentInfo: {
      bankAccount: bank,
      personalAllowance: getPersonalAllowance(application),
      personalAllowanceFromSpouse: getPersonalAllowance(application, true),
      union: {
        // If a union is not selected then use the default 'no union' value
        id: union ?? apiConstants.unions.noUnion,
        name: '',
      } as Union,
      pensionFund: getPensionFund(application),
      privatePensionFund: getPensionFund(application, true),
      privatePensionFundRatio: getPrivatePensionFundRatio(application),
    },
    periods,
    employers: [getEmployer(application, selfEmployed)],
    status: 'In Progress',
    rightsCode: getRightsCode(application),
    attachments,
  }
}

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/parental-leave/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./parental-leave-assets/${file}`)
}
