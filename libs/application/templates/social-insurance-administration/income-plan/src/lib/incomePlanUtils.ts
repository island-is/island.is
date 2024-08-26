import { getValueViaPath } from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import {
  CategorizedIncomeTypes,
  IncomePlanRow,
  WithholdingTax,
  LatestIncomePlan,
} from '../types'

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
    'socaialInsuranceAdministrationWithholdingTax.data',
  ) as WithholdingTax

  const latestIncomePlan = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationLatestIncomePlan.data',
  ) as LatestIncomePlan

  const isEligible = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data.isEligible',
  ) as boolean

  const userProfileEmail = getValueViaPath(
    externalData,
    'userProfile.data.email',
  ) as string

  const userProfilePhoneNumber = getValueViaPath(
    externalData,
    'userProfile.data.mobilePhoneNumber',
  ) as string

  return {
    categorizedIncomeTypes,
    currencies,
    withholdingTax,
    latestIncomePlan,
    isEligible,
    userProfileEmail,
    userProfilePhoneNumber,
  }
}

export const getApplicationAnswers = (answers: Application['answers']) => {
  const incomePlan = getValueViaPath(
    answers,
    'incomePlanTable',
    [],
  ) as IncomePlanRow[]

  return { incomePlan }
}


const getOneInstanceOfCategory = (categories: CategorizedIncomeTypes[]) => {
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
  return isEligible
}
