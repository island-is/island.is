import jwt from 'jsonwebtoken'
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
import { Application } from '@island.is/application/types'
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
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  NO,
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
    otherParent,
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

  if (fromSpouse && otherParent === NO) {
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

  const { applicationType } = getApplicationAnswers(application.answers)

  const value =
    applicationType === PARENTAL_LEAVE
      ? get(application.answers, getter, isPrivate ? null : undefined)
      : apiConstants.pensionFunds.noPensionFundId

  if (isPrivate) {
    return {
      id:
        applicationType === PARENTAL_LEAVE
          ? typeof value === 'string'
            ? value
            : apiConstants.pensionFunds.noPrivatePensionFundId
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
  const {
    privatePensionFundPercentage,
    applicationType,
  } = getApplicationAnswers(application.answers)
  const privatePensionFundRatio: number =
    applicationType === PARENTAL_LEAVE
      ? Number(privatePensionFundPercentage) || 0
      : 0

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

  /*
   ** If we got RightCodePeriod from VMST then use it ( only basic/grunnrétt )
   */
  const rightCodePeriod = answers.periods[0]?.rightCodePeriod
  if (rightCodePeriod) {
    return rightCodePeriod
  }

  const isSelfEmployed = answers.isSelfEmployed === YES
  const isUnemployed = answers.applicationType === PARENTAL_GRANT
  const isStudent = answers.applicationType === PARENTAL_GRANT_STUDENTS

  if (selectedChild.parentalRelation === ParentalRelations.primary) {
    if (isUnemployed) {
      return 'M-FS'
    } else if (isStudent) {
      return 'M-FSN'
    } else if (isSelfEmployed) {
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
    if (isUnemployed) {
      return `${parentPrefix}-FS`
    } else if (isStudent) {
      return `${parentPrefix}-FSN`
    } else if (isSelfEmployed) {
      return `${parentPrefix}-S-GR`
    } else {
      return `${parentPrefix}-L-GR`
    }
  }

  if (isUnemployed) {
    return `${parentPrefix}-FL-FS`
  } else if (isStudent) {
    return `${parentPrefix}-FL-FSN`
  } else if (isSelfEmployed) {
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
      ratio: period.ratio,
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
  onlyValidate?: boolean,
): ParentalLeave => {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  const {
    isSelfEmployed,
    union,
    bank,
    applicationType,
    isRecivingUnemploymentBenefits,
    multipleBirths,
  } = getApplicationAnswers(application.answers)

  const { applicationFundId } = getApplicationExternalData(
    application.externalData,
  )

  const { email, phoneNumber } = getApplicantContactInfo(application)
  const selfEmployed = isSelfEmployed === YES
  const recivingUnemploymentBenefits = isRecivingUnemploymentBenefits === YES

  const testData: string = onlyValidate!.toString()

  return {
    applicationId: application.id,
    applicationFundId: applicationFundId,
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
        id:
          applicationType === PARENTAL_LEAVE
            ? union ?? apiConstants.unions.noUnion
            : apiConstants.unions.noUnion,
        name: '',
      } as Union,
      pensionFund: getPensionFund(application),
      privatePensionFund: getPensionFund(application, true),
      privatePensionFundRatio: getPrivatePensionFundRatio(application),
    },
    periods,
    employers:
      applicationType === PARENTAL_LEAVE && !recivingUnemploymentBenefits
        ? [getEmployer(application, selfEmployed)]
        : [],
    status: 'In Progress',
    rightsCode: getRightsCode(application),
    attachments,
    testData,
    noOfChildren:
      multipleBirths && multipleBirths > 1
        ? multipleBirths.toString()
        : undefined,
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

export const getRatio = (
  ratio: string,
  length: string,
  shouldUseLength: boolean,
) => (shouldUseLength ? `D${length}` : `${ratio}`)

export const createAssignTokenWithoutNonce = (
  application: Application,
  secret: string,
  expiresIn: number,
) => {
  const token = jwt.sign(
    {
      applicationId: application.id,
      state: application.state,
    },
    secret,
    { expiresIn },
  )

  return token
}
