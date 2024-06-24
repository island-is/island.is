import { getValueViaPath } from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { categorizedIncomeTypes, withholdingTax } from '../types'

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

  return {
    categorizedIncomeTypes,
    currencies,
    withholdingTax,
  }
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
  categoryName: string,
) => {
  const { categorizedIncomeTypes } = getApplicationExternalData(externalData)

  return categorizedIncomeTypes
    .filter((item) => item.categoryName === categoryName)
    .map((item) => {
      return {
        value: item.incomeTypeName || '',
        label: item.incomeTypeName || '',
      }
    })
}
