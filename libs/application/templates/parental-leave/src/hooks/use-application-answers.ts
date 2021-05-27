import {
  Application,
  getValueViaPath,
  ValidAnswers,
} from '@island.is/application/core'

import { MANUAL, NO, YES } from '../constants'

type OtherParent = typeof NO | typeof MANUAL | undefined
export type Boolean = typeof NO | typeof YES

/**
 * Hook used to return different fields from the application answers object
 */
export const useApplicationAnswers = (application: Application) => {
  const answers = application.answers

  const otherParent = getValueViaPath(answers, 'otherParent') as OtherParent

  const privatePensionFund = getValueViaPath(
    answers,
    'usePrivatePensionFund',
  ) as Boolean

  const isSelfEmployed = getValueViaPath(
    answers,
    'employer.isSelfEmployed',
  ) as Boolean

  const otherParentName = getValueViaPath(answers, 'otherParentName') as string

  const otherParentId = getValueViaPath(answers, 'otherParentId') as string

  const bank = getValueViaPath(answers, 'payments.bank') as string

  const personalAllowance = getValueViaPath(
    answers,
    'usePersonalAllowance',
  ) as Boolean

  const personalAllowanceFromSpouse = getValueViaPath(
    answers,
    'usePersonalAllowanceFromSpouse',
  ) as Boolean

  const personalUseAsMuchAsPossible = getValueViaPath(
    answers,
    'personalAllowance.useAsMuchAsPossible',
  ) as Boolean

  const personalUsage = getValueViaPath(
    answers,
    'personalAllowance.usage',
  ) as string

  const spouseUseAsMuchAsPossible = getValueViaPath(
    answers,
    'personalAllowanceFromSpouse.useAsMuchAsPossible',
  ) as Boolean

  const spouseUsage = getValueViaPath(
    answers,
    'personalAllowanceFromSpouse.usage',
  ) as string

  const employerEmail = getValueViaPath(answers, 'employer.email') as string

  const shareInformationWithOtherParent = getValueViaPath(
    answers,
    'shareInformationWithOtherParent',
  ) as Boolean

  const selectedChild = getValueViaPath(answers, 'selectedChild') as string

  const isRequestingRights = getValueViaPath(
    answers,
    'requestRights.isRequestingRights',
  ) as Boolean

  const requestDays = getValueViaPath(
    answers,
    'requestRights.requestDays',
  ) as number

  const isGivingRights = getValueViaPath(
    answers,
    'giveRights.isGivingRights',
  ) as Boolean

  const giveDays = getValueViaPath(answers, 'giveRights.giveDays') as number

  return {
    otherParent,
    privatePensionFund,
    isSelfEmployed,
    otherParentName,
    otherParentId,
    bank,
    personalAllowance,
    personalAllowanceFromSpouse,
    personalUseAsMuchAsPossible,
    personalUsage,
    spouseUseAsMuchAsPossible,
    spouseUsage,
    employerEmail,
    shareInformationWithOtherParent,
    selectedChild,
    isRequestingRights,
    requestDays,
    isGivingRights,
    giveDays,
  }
}
