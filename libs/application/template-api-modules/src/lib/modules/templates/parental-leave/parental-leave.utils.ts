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
import { FamilyMember } from '@island.is/api/domains/national-registry'
import {
  getSelectedChild,
  getApplicationAnswers,
} from '@island.is/application/templates/parental-leave'

import { apiConstants, formConstants } from './constants'

const extractAnswer = <T>(
  object: unknown,
  path: string,
  defaultValue: unknown | undefined = undefined,
): T => {
  const value = get(object, path, defaultValue)

  if (defaultValue === undefined && typeof value === 'undefined') {
    throw new Error(
      `transformApplicationToParentalLeaveDTO.extractAnswer: missing value for ${path}`,
    )
  }

  return value
}

export const getPersonalAllowance = (
  application: Application,
  fromSpouse = false,
): number => {
  const usePersonalAllowanceGetter = fromSpouse
    ? 'usePersonalAllowanceFromSpouse'
    : 'usePersonalAllowance'
  const useMaxGetter = fromSpouse
    ? 'personalAllowanceFromSpouse.useAsMuchAsPossible'
    : 'personalAllowance.useAsMuchAsPossible'
  const usageGetter = fromSpouse
    ? 'personalAllowanceFromSpouse.usage'
    : 'personalAllowance.usage'

  const willUsePersonalAllowance =
    get(
      application.answers,
      usePersonalAllowanceGetter,
      formConstants.boolean.false,
    ) === formConstants.boolean.true

  if (!willUsePersonalAllowance) {
    return 0
  }

  const willUseMax =
    extractAnswer(application.answers, useMaxGetter) ===
    formConstants.boolean.true

  if (willUseMax) {
    return 100
  }

  const usage = Number(extractAnswer(application.answers, usageGetter))

  return usage
}

export const getEmployer = (
  application: Application,
  isSelfEmployed = false,
): Employer => ({
  email: isSelfEmployed
    ? extractAnswer(application.answers, 'applicant.email')
    : extractAnswer(application.answers, 'employer.email'),
  nationalRegistryId: isSelfEmployed
    ? application.applicant
    : extractAnswer(application.answers, 'employer.nationalRegistryId'),
})

export const getOtherParentId = (application: Application): string | null => {
  const otherParent = extractAnswer<string>(
    application.answers,
    'otherParent',
    null,
  )
  const otherParentId = extractAnswer<string | null>(
    application.answers,
    'otherParentId',
    null,
  )

  if (otherParent === formConstants.spouseSelection.spouse) {
    const familyMembers: FamilyMember[] | null = extractAnswer(
      application.externalData,
      'family.data',
      null,
    )

    if (familyMembers === null) {
      throw new Error(
        'transformApplicationToParentalLeaveDTO: Cannot find spouse. Missing data for family members.',
      )
    }

    const spouse = familyMembers.find(
      (member) =>
        member.familyRelation === formConstants.spouseSelection.spouse,
    )

    if (!spouse) {
      throw new Error(
        'transformApplicationToParentalLeaveDTO: Cannot find spouse. No family member with this relation.',
      )
    }

    return spouse.nationalId
  }

  return otherParentId
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
  const rawPrivatePensionFundRatio: string | undefined = extractAnswer(
    application.answers,
    'payments.privatePensionFundPercentage',
    '0',
  )
  const privatePensionFundRatio: number =
    Number(rawPrivatePensionFundRatio) || 0

  return privatePensionFundRatio
}

export const getApplicantContactInfo = (application: Application) => {
  const email =
    get(application.answers, 'applicant.email') ||
    get(application.externalData, 'userProfile.data.email')

  const phoneNumber =
    get(application.answers, 'applicant.phoneNumber') ||
    get(application.externalData, 'userProfile.data.mobilePhoneNumber')

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
  const isSelfEmployed = answers.isSelfEmployed === 'yes'
  const isPrimaryParent = selectedChild.parentalRelation === 'primary'

  if (isPrimaryParent) {
    if (isSelfEmployed) {
      return 'M-S-GR'
    } else {
      return 'M-L-GR'
    }
  } else {
    // Only focusing on unborn children in phase 1
    if (isSelfEmployed) {
      return 'FO-FL-S-GR'
    } else {
      return 'FO-FL-L-GR'
    }
  }
}

export const transformApplicationToParentalLeaveDTO = (
  application: Application,
  attachments?: Attachment[],
): ParentalLeave => {
  const periodsAnswer = extractAnswer<
    {
      startDate: string
      endDate: string
      ratio: string
    }[]
  >(application.answers, 'periods')
  let periods: Period[] = []

  if (periodsAnswer) {
    periods = periodsAnswer.map((period) => ({
      from: period.startDate,
      // TODO: refactor period.endDate to not include time
      to: period.endDate.split('T')[0],
      ratio: Number(period.ratio),
      approved: false,
      paid: false,
    }))
  }

  const isSelfEmployed =
    extractAnswer(application.answers, 'employer.isSelfEmployed') ===
    formConstants.boolean.true

  const union: Union = {
    id: extractAnswer(application.answers, 'payments.union'),
    name: '',
  }

  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  if (!selectedChild) {
    throw new Error('Missing selected child')
  }

  const { email, phoneNumber } = getApplicantContactInfo(application)

  return {
    applicationId: application.id,
    applicant: application.applicant,
    otherParentId: getOtherParentId(application),
    expectedDateOfBirth: selectedChild.expectedDateOfBirth,
    // TODO: get true date of birth, not expected
    // will get it from a new Þjóðskrá API (returns children in custody of a national registry id)
    dateOfBirth: selectedChild.expectedDateOfBirth,
    email,
    phoneNumber,
    paymentInfo: {
      bankAccount: extractAnswer(application.answers, 'payments.bank'),
      personalAllowance: getPersonalAllowance(application),
      personalAllowanceFromSpouse: getPersonalAllowance(application, true),
      union,
      pensionFund: getPensionFund(application),
      privatePensionFund: getPensionFund(application, true),
      privatePensionFundRatio: getPrivatePensionFundRatio(application),
    },
    periods,
    employers: [getEmployer(application, isSelfEmployed)],
    status: 'In Progress',
    rightsCode: getRightsCode(application),
    attachments,
  }
}
