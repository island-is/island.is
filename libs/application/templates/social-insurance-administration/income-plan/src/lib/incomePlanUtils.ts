import { getValueViaPath } from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import {
  CategorizedIncomeTypes,
  Eligible,
  IncomePlanConditions,
  IncomePlanRow,
  LatestIncomePlan,
  WithholdingTax,
} from '../types'
import { NO_ACTIVE_APPLICATIONS, INCOME_PLANS_CLOSED } from './constants'
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

export const getOneInstanceOfCategory = (
  categories: CategorizedIncomeTypes[],
) => {
  return [
    ...new Map(
      categories.map((category) => [category.categoryName, category]),
    ).values(),
  ]
}

export const getCategoriesOptions = (externalData: ExternalData) => {
  const { categorizedIncomeTypes } = getApplicationExternalData(externalData)
  const categories = getOneInstanceOfCategory(categorizedIncomeTypes)

  return (
    categories &&
    categories.map((item) => {
      return {
        value: item.categoryName || '',
        label: item.categoryName || '',
      }
    })
  )
}

export const getTypesOptions = (
  externalData: ExternalData,
  categoryName: string | undefined,
) => {
  const { categorizedIncomeTypes } = getApplicationExternalData(externalData)
  if (categoryName === undefined) return []

  return categorizedIncomeTypes
    .filter((item) => item.categoryName === categoryName)
    .map((item) => {
      return {
        value: item.incomeTypeName || '',
        label: item.incomeTypeName || '',
      }
    })
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

export const defaultIncomeTypes = [
  {
    income: 'yearly',
    currency: 'IKR',
    incomeType: 'Lífeyrissjóður',
    incomePerYear: '0',
    incomeCategory: 'Lífeyrissjóðstekjur',
  },
  {
    income: 'yearly',
    currency: 'IKR',
    incomeType: 'Laun',
    incomePerYear: '0',
    incomeCategory: 'Atvinnutekjur',
  },
  {
    income: 'yearly',
    currency: 'IKR',
    incomeType: 'Vextir af innistæðum',
    incomePerYear: '0',
    incomeCategory: 'Fjármagnstekjur',
  },
  {
    income: 'yearly',
    currency: 'EUR',
    incomeType: 'Erlendur lífeyrir',
    incomePerYear: '0',
    incomeCategory: 'Lífeyrissjóðstekjur',
  },
  {
    income: 'yearly',
    currency: 'IKR',
    incomeType: 'Vextir af verðbréfum',
    incomePerYear: '0',
    incomeCategory: 'Fjármagnstekjur',
  },
]
