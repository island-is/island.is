import { getValueViaPath } from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import {
  categorizedIncomeTypes,
  incomePlanRow,
  withholdingTax,
  latestIncomePlan,
} from '../types'

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const categorizedIncomeTypes = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCategorizedIncomeTypes.data',
    [],
  ) as categorizedIncomeTypes[]

  const currencies = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCurrencies.data',
  ) as Array<string>

  const withholdingTax = getValueViaPath(
    externalData,
    'socaialInsuranceAdministrationWithholdingTax.data',
  ) as withholdingTax

  const latestIncomePlan = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationLatestIncomePlan.data',
  ) as latestIncomePlan

  const isEligible = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationIsApplicantEligible.data.isEligible',
  ) as boolean

  return {
    categorizedIncomeTypes,
    currencies,
    withholdingTax,
    latestIncomePlan,
    isEligible,
  }
}

export const getApplicationAnswers = (answers: Application['answers']) => {
  const income = getValueViaPath(
    answers,
    'incomePlanTable',
    [],
  ) as incomePlanRow[]

  return { income }
}

const getOneInstanceOfCategory = (categories: categorizedIncomeTypes[]) => {
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
