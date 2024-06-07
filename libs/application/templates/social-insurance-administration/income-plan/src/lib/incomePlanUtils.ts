import { getValueViaPath } from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { categorizedIncomeTypes } from '../types'

export const getApplicationExternalData = (
  externalData: Application['externalData'],
) => {
  const categorizedIncomeTypes = getValueViaPath(
    externalData,
    'socialInsuranceAdministrationCategorizedIncomeTypes.data',
    [],
  ) as categorizedIncomeTypes[]

  return {
    categorizedIncomeTypes,
  }
}

export const getCategoriesOptions = (externalData: ExternalData) => {
  const { categorizedIncomeTypes } = getApplicationExternalData(externalData)
  const categories = [
    ...new Map(
      categorizedIncomeTypes.map((category) => [
        category.categoryName,
        category,
      ]),
    ).values(),
  ]

  return (
    (categories &&
      categories.map((item) => {
        return {
          value: item.categoryCode!, // taka af ! ?
          label: item.categoryName!,
        }
      })) ||
    []
  )
}

export const getTypesOptions = (
  externalData: ExternalData,
  categoryCode: string,
): { value: string; label: string }[] => {
  const { categorizedIncomeTypes } = getApplicationExternalData(externalData)

  return categorizedIncomeTypes
    .filter((item) => item.categoryCode === categoryCode)
    .map((item) => {
      return {
        value: item.incomeTypeCode!, // taka af ! ?
        label: item.incomeTypeName!,
      }
    })
}
