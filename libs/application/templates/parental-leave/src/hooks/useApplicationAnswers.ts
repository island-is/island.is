import { Application, getValueViaPath } from '@island.is/application/core'

import { YES, NO } from '../constants'
import { maxDaysToGiveOrReceive } from '../config'
import { Boolean, OtherParent } from '../types'
import { SchemaFormValues } from '../lib/dataSchema'

export type ApplicationAnswers = ReturnType<typeof useApplicationAnswers>

const getOrFallback = (condition: Boolean, value: number | undefined) => {
  if (condition === YES) {
    // In the first version of the app, we can't manually change the number of
    // days requested or given, so we use the maximum number of days in this case
    if (value === undefined) {
      return maxDaysToGiveOrReceive
    }

    return value
  }

  return 0
}

export const useApplicationAnswers = (application: Application) => {
  const { answers } = application

  const otherParent = getValueViaPath(answers, 'otherParent') as OtherParent

  const pensionFund = getValueViaPath(answers, 'payments.pensionFund') as string

  const union = getValueViaPath(answers, 'payments.union') as string

  const usePrivatePensionFund = getValueViaPath(
    answers,
    'usePrivatePensionFund',
  ) as Boolean

  const privatePensionFund = getValueViaPath(
    answers,
    'payments.privatePensionFund',
  ) as string

  const privatePensionFundPercentage = getValueViaPath(
    answers,
    'payments.privatePensionFundPercentage',
  ) as string

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
    NO,
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

  const requestValue = getValueViaPath(answers, 'requestRights.requestDays') as
    | number
    | undefined

  const requestDays = getOrFallback(isRequestingRights, requestValue)

  const isGivingRights = getValueViaPath(
    answers,
    'giveRights.isGivingRights',
  ) as Boolean

  const giveValue = getValueViaPath(answers, 'giveRights.giveDays') as
    | number
    | undefined

  const giveDays = getOrFallback(isGivingRights, giveValue)

  const computedPersonalDays = Number(
    getValueViaPath(
      answers,
      'computedRightsPersonalDays',
      0,
    ) as SchemaFormValues['computedRightsPersonalDays'],
  )

  const computedExtraDays = Number(
    getValueViaPath(
      answers,
      'computedRightsExtraDays',
      0,
    ) as SchemaFormValues['computedRightsExtraDays'],
  )

  return {
    otherParent,
    pensionFund,
    union,
    usePrivatePensionFund,
    privatePensionFund,
    privatePensionFundPercentage,
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
    computedPersonalDays,
    computedExtraDays,
  }
}
