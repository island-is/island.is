import jwt from 'jsonwebtoken'
import get from 'lodash/get'
import set from 'lodash/set'
import { join } from 'path'

import {
  ADOPTION,
  Period as AnswerPeriod,
  ChildInformation,
  Languages,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  PERMANENT_FOSTER_CARE,
  ParentalRelations,
  applicantIsMale,
  formatBankInfo,
  getActionName,
  getApplicationAnswers,
  getApplicationExternalData,
  getOtherParentId,
  getSelectedChild,
  getSpouse,
  getVmstApplicationId,
} from '@island.is/application/templates/parental-leave'
import {
  Application,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import {
  ApplicationRights,
  Attachment,
  Employer,
  ParentalLeave,
  PensionFund,
  Period,
  Union,
} from '@island.is/clients/vmst'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { apiConstants } from './constants'
import { getValueViaPath, NO, YES } from '@island.is/application/core'

// Check whether phoneNumber is GSM
export const checkIfPhoneNumberIsGSM = (phoneNumber: string): boolean => {
  const phoneNumberStartStr = ['6', '7', '8']
  return phoneNumberStartStr.some((substr) => phoneNumber.startsWith(substr))
}

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
): Employer[] => {
  const {
    applicantEmail,
    employers,
    employerNationalRegistryId,
    employerReviewerNationalRegistryId,
  } = getApplicationAnswers(application.answers)

  if (isSelfEmployed) {
    return [
      {
        email: applicantEmail,
        nationalRegistryId: application.applicant,
      },
    ]
  }

  return employers.map((e) => ({
    email: e.email,
    nationalRegistryId:
      e.companyNationalRegistryId || employerNationalRegistryId || '',
    approverNationalRegistryId:
      e.reviewerNationalRegistryId || employerReviewerNationalRegistryId || '',
  }))
}

export const getPensionFund = (
  application: Application,
  isPrivate = false,
): PensionFund => {
  const getter = isPrivate
    ? 'payments.privatePensionFund'
    : 'payments.pensionFund'

  const { applicationType, usePrivatePensionFund } = getApplicationAnswers(
    application.answers,
  )

  const value =
    applicationType === PARENTAL_LEAVE
      ? get(application.answers, getter, isPrivate ? null : undefined)
      : apiConstants.pensionFunds.noPensionFundId

  if (isPrivate) {
    return {
      id:
        applicationType === PARENTAL_LEAVE && usePrivatePensionFund === YES
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
    usePrivatePensionFund,
  } = getApplicationAnswers(application.answers)
  const privatePensionFundRatio: number =
    applicationType === PARENTAL_LEAVE && usePrivatePensionFund === YES
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
    const periodCodeStartCharacters = ['M', 'F']
    if (periodCodeStartCharacters.some((c) => rightCodePeriod.startsWith(c))) {
      return rightCodePeriod
    }
  }

  const isSelfEmployed = answers.isSelfEmployed === YES
  const isUnemployed = answers.applicationType === PARENTAL_GRANT
  const isStudent = answers.applicationType === PARENTAL_GRANT_STUDENTS

  const primaryParentPrefix = parentPrefix(application, selectedChild)

  if (selectedChild.parentalRelation === ParentalRelations.primary) {
    return rightsCodeSuffix(
      primaryParentPrefix,
      isUnemployed,
      isStudent,
      isSelfEmployed,
    )
  }

  const spouse = getSpouse(application)
  const parentsAreInRegisteredCohabitation =
    selectedChild.primaryParentNationalRegistryId === spouse?.nationalId

  const secondaryParentPrefix = parentPrefix(application, selectedChild)

  if (parentsAreInRegisteredCohabitation) {
    // If this secondary parent is in registered cohabitation with primary parent
    // then they will automatically be granted custody
    return rightsCodeSuffix(
      primaryParentPrefix,
      isUnemployed,
      isStudent,
      isSelfEmployed,
    )
  }

  if (isUnemployed) {
    return `${secondaryParentPrefix}-FL-FS`
  } else if (isStudent) {
    return `${secondaryParentPrefix}-FL-FSN`
  } else if (isSelfEmployed) {
    return `${secondaryParentPrefix}-FL-S-GR`
  } else {
    return `${secondaryParentPrefix}-FL-L-GR`
  }
}

export const parentPrefix = (
  application: Application,
  selectedChild: ChildInformation,
) => {
  const isFosterCare = isPermanentFosterCare(selectedChild, application)
  const isAdoption = isPrimaryAdoption(selectedChild, application)

  if (isFosterCare) {
    if (selectedChild.parentalRelation === ParentalRelations.primary) {
      return applicantIsMale(application) ? 'F-FÓ' : 'M-FÓ'
    } else {
      if (selectedChild.primaryParentGenderCode === '1') {
        return 'FO-FÓ'
      } else {
        return applicantIsMale(application) ? 'F-FÓ' : 'FO-FÓ'
      }
    }
  } else if (isAdoption) {
    if (selectedChild.parentalRelation === ParentalRelations.primary) {
      return applicantIsMale(application) ? 'F-Æ' : 'M-Æ'
    } else {
      if (selectedChild.primaryParentGenderCode === '1') {
        return 'FO-Æ'
      } else {
        return applicantIsMale(application) ? 'F-Æ' : 'FO-Æ'
      }
    }
  } else {
    return selectedChild.parentalRelation === ParentalRelations.primary
      ? 'M'
      : applicantIsMale(application)
      ? 'F'
      : 'FO'
  }
}

export const rightsCodeSuffix = (
  prefix: string,
  isUnemployed: boolean,
  isStudent: boolean,
  isSelfEmployed: boolean,
) => {
  if (isUnemployed) {
    return `${prefix}-FS`
  } else if (isStudent) {
    return `${prefix}-FSN`
  } else if (isSelfEmployed) {
    return `${prefix}-S-GR`
  } else {
    if (prefix === 'F-FÓ' || prefix === 'FO-FÓ') return `${prefix}-GR`
    return `${prefix}-L-GR`
  }
}

export const isPermanentFosterCare = (
  selectedChild: ChildInformation,
  application: Application,
) => {
  const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(
    application.answers,
  )

  return selectedChild.parentalRelation === ParentalRelations.primary
    ? noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE
    : selectedChild.primaryParentTypeOfApplication === PERMANENT_FOSTER_CARE
}

export const isPrimaryAdoption = (
  selectedChild: ChildInformation,
  application: Application,
) => {
  const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(
    application.answers,
  )

  return selectedChild.parentalRelation === ParentalRelations.primary
    ? noChildrenFoundTypeOfApplication === ADOPTION
    : selectedChild.primaryParentTypeOfApplication === ADOPTION
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
  type?:
    | 'period'
    | 'documentPeriod'
    | 'document'
    | 'empper'
    | 'employer'
    | 'empdoc'
    | 'empdocper'
    | undefined,
  applicationRights?: ApplicationRights[],
): ParentalLeave => {
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  const {
    union,
    useUnion,
    bank,
    applicationType,
    multipleBirths,
    isSelfEmployed,
    isReceivingUnemploymentBenefits,
    employerLastSixMonths,
    language,
    otherParentRightOfAccess,
    comment,
  } = getApplicationAnswers(application.answers)

  const { applicationFundId, VMSTOtherParent } = getApplicationExternalData(
    application.externalData,
  )

  const { email, phoneNumber } = getApplicantContactInfo(application)
  const selfEmployed = isSelfEmployed === YES
  const receivingUnemploymentBenefits = isReceivingUnemploymentBenefits === YES
  const testData: string = onlyValidate!.toString()
  const isFosterCareOrAdoption =
    isPermanentFosterCare(selectedChild, application) ||
    isPrimaryAdoption(selectedChild, application)

  return {
    // Not `application.id` — a change application descends from an earlier one and
    // has to keep identifying itself to VMST by the id of the root application.
    applicationId: getVmstApplicationId(application),
    applicationFundId: applicationFundId,
    applicant: application.applicant,
    otherParentId:
      VMSTOtherParent?.otherParentId ?? getOtherParentId(application),
    expectedDateOfBirth: isFosterCareOrAdoption
      ? isDateInTheFuture(selectedChild.dateOfBirth!)
        ? selectedChild.dateOfBirth!
        : ''
      : selectedChild.expectedDateOfBirth,
    // TODO: get true date of birth, not expected
    // will get it from a new Þjóðskrá API (returns children in custody of a national registry id)
    dateOfBirth: isFosterCareOrAdoption
      ? isDateInTheFuture(selectedChild.dateOfBirth!)
        ? ''
        : selectedChild.dateOfBirth!
      : '',
    adoptionDate: isFosterCareOrAdoption ? selectedChild.adoptionDate : '',
    email,
    phoneNumber,
    paymentInfo: {
      bankAccount: formatBankInfo(bank),
      personalAllowance: getPersonalAllowance(application),
      personalAllowanceFromSpouse: getPersonalAllowance(application, true),
      union: {
        // If a union is not selected then use the default 'no union' value
        id:
          applicationType === PARENTAL_LEAVE && useUnion === YES
            ? union ?? apiConstants.unions.noUnion
            : apiConstants.unions.noUnion,
        name: '',
      } as Union,
      pensionFund: getPensionFund(application),
      privatePensionFund: getPensionFund(application, true),
      privatePensionFundRatio: getPrivatePensionFundRatio(application),
    },
    periods,
    applicationComment: comment,
    employers:
      (applicationType === PARENTAL_LEAVE && !receivingUnemploymentBenefits) ||
      ((applicationType === PARENTAL_GRANT ||
        applicationType === PARENTAL_GRANT_STUDENTS) &&
        employerLastSixMonths === YES)
        ? getEmployer(application, selfEmployed)
        : [],
    status: 'In Progress',
    rightsCode: getRightsCode(application),
    attachments,
    testData,
    noOfChildren:
      multipleBirths && multipleBirths > 1
        ? multipleBirths.toString()
        : undefined,
    type,
    language: language === Languages.EN ? language : undefined, // Only send language if EN
    otherParentBlocked: otherParentRightOfAccess === NO ? true : false,
    applicationRights,
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

export const isDateInTheFuture = (date: string) => {
  const now = new Date().toISOString()
  if (date > now) return true
  return false
}

export const getType = (application: ApplicationWithAttachments) => {
  const { actionName } = getApplicationAnswers(application.answers)

  // Check if we can get the the action name. Used when valiating application
  const tmpActionName = getActionName(application)

  // `'other'` is an internal marker for an info-only change (base info, rights,
  // payments, personal allowance, other parent). VMST rejects it as an unknown
  // type, and the field is nullable there, so drop it before sending.
  const resolved = tmpActionName ?? actionName
  if (
    resolved === 'document' ||
    resolved === 'documentPeriod' ||
    resolved === 'period' ||
    resolved === 'empper' ||
    resolved === 'employer' ||
    resolved === 'empdoc' ||
    resolved === 'empdocper'
  ) {
    return resolved
  }

  return undefined
}

export const getFromDate = (
  isFirstPeriod: boolean,
  isActualDateOfBirth: boolean,
  useLength: string,
  endDateAdjustLength: boolean,
  period: AnswerPeriod,
) => {
  return isFirstPeriod &&
    isActualDateOfBirth &&
    (useLength === YES || (useLength === NO && endDateAdjustLength))
    ? apiConstants.actualDateOfBirthMonths
    : isFirstPeriod && isActualDateOfBirth
    ? apiConstants.actualDateOfBirth
    : period.startDate
}

export const isFixedRight = (right: string | undefined) => {
  if (!right) {
    return false
  }
  return ['VEIKMEÐG', 'ÖRYGGI-L', 'DVALSTYRK', 'DVAL.FJÖL'].includes(right)
}

/**
 * Answer paths a follow-up application inherits from the application it
 * continues. These describe the leave itself, so a `change` application starts
 * from what the applicant already told us rather than asking again.
 *
 * Deliberately absent: anything scoped to a single action. `actionName`,
 * `addEmployer`, `addPeriods`, `changeEmployer`, `changePeriods`,
 * `changeApplicationInfo`, `isResidenceGrant`, `hasAppliedForReidenceGrant` and
 * the per-action file uploads all describe what the *previous* action did and
 * would make the new application look like it had already changed something.
 */
const CARRY_OVER_ANSWER_PATHS = [
  // A mock application was never really sent to VMST — its fund id is the literal
  // 'mock-application-fund-id'. A follow-up therefore has to stay in mock mode,
  // otherwise it calls VMST for real with a fund id that does not exist there.
  'mock',
  'noChildrenFound',
  'fosterCareOrAdoption',
  'noPrimaryParent',
] as const

/**
 * Picks the answers a follow-up application inherits. Paths that are absent on
 * the source are left out entirely rather than written as `undefined`, so the new
 * application's answers stay clean and `getValueViaPath` defaults still apply.
 */
export const pickCarryOverAnswers = (
  answers: Application['answers'],
): Record<string, unknown> => {
  const carried: Record<string, unknown> = {}

  for (const path of CARRY_OVER_ANSWER_PATHS) {
    const value = getValueViaPath(answers, path)

    if (value === undefined || value === null) {
      continue
    }

    set(carried, path, value)
  }

  return carried
}
