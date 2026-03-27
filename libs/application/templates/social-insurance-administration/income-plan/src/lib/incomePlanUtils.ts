import { getValueViaPath } from '@island.is/application/core'
import {
  CategorizedIncomeTypes,
  Eligible,
  IncomePlanConditions,
  IncomePlanRow,
  LatestIncomePlan,
} from '@island.is/application/templates/social-insurance-administration-core/types'
import { Application, ExternalData } from '@island.is/application/types'
import { WithholdingTax } from '../types'
import { INCOME_PLANS_CLOSED, NO_ACTIVE_APPLICATIONS } from './constants'
import { incomePlanFormMessage } from './messages'

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const categorizedIncomeTypes = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCategorizedIncomeTypes.data',
    [],
  ) as CategorizedIncomeTypes[]

  const currencies = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCurrencies.data',
  ) as Array<string>

  const withholdingTax = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationWithholdingTax.data',
  ) as WithholdingTax

  const latestIncomePlan = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationLatestIncomePlan.data',
  ) as LatestIncomePlan

  const temporaryCalculation = getValueViaPath(
    externalData,
    'SocialInsuranceAdministrationTemporaryCalculation.data',
  )

  const isEligible = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data',
  ) as Eligible

  const userProfileEmail = getValueViaPath(
    externalData,
    'userProfile.data.email',
  ) as string

  const userProfilePhoneNumber = getValueViaPath(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  ) as string

  const incomePlanConditions = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIncomePlanConditions.data',
  ) as IncomePlanConditions

  return {
    categorizedIncomeTypes,
    currencies,
    withholdingTax,
    latestIncomePlan,
    temporaryCalculation,
    isEligible,
    userProfileEmail,
    userProfilePhoneNumber,
    incomePlanConditions,
  }
}

export const getApplicationAnswers = (answers: Application['answers']) => {
  const incomePlan = getValueViaPath(
    answers,
    'incomePlanTable',
    [],
  ) as IncomePlanRow[]

  const temporaryCalculationMonth = getValueViaPath(
    answers,
    'temporaryCalculation.month',
  ) as string

  const temporaryCalculationShow = getValueViaPath(
    answers,
    'temporaryCalculation.show',
    false,
  ) as boolean

  return {
    incomePlan,
    temporaryCalculationMonth,
    temporaryCalculationShow,
  }
}

export const isEligible = (externalData: ExternalData): boolean => {
  const { isEligible } = getApplicationExternalData(externalData)

  return isEligible?.isEligible
}

export const eligibleText = (externalData: ExternalData) => {
  const { isEligible } = getApplicationExternalData(externalData)
  return isEligible.reasonCode === INCOME_PLANS_CLOSED
    ? incomePlanFormMessage.pre.isNotEligibleClosedDescription
    : isEligible.reasonCode === NO_ACTIVE_APPLICATIONS
    ? incomePlanFormMessage.pre.isNotEligibleNoActiveApplicationDescription
    : incomePlanFormMessage.pre.isNotEligibleDescription
}
