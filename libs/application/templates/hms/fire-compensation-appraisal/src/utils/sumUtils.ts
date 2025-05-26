import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { Fasteign } from '@island.is/clients/assets'

export const sumUsageUnitsFireCompensation = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const realEstateId = getValueViaPath<string>(answers, 'realEstate')
  const usageUnits = getValueViaPath<Array<string>>(answers, 'usageUnits')
  const properties = getValueViaPath<Array<Fasteign>>(
    externalData,
    'getProperties.data',
  )

  const property = properties?.find(
    (property) => property.fasteignanumer === realEstateId,
  )

  const usageUnitsFireAppraisal =
    property?.notkunareiningar?.notkunareiningar?.map((unit) => {
      if (usageUnits?.includes(unit.notkunareininganumer ?? '')) {
        return unit.brunabotamat
      }
      return 0
    })

  const total = usageUnitsFireAppraisal?.reduce((acc, curr) => {
    return (acc ?? 0) + (curr ?? 0)
  }, 0)

  return `${total ?? 0}`
}

export const totalFireCompensation = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const realEstateId = getValueViaPath<string>(answers, 'realEstate')
  const properties = getValueViaPath<Array<Fasteign>>(
    externalData,
    'getProperties.data',
  )

  const property = properties?.find(
    (property) => property.fasteignanumer === realEstateId,
  )

  const totalFireCompensation =
    property?.notkunareiningar?.notkunareiningar?.reduce((acc, curr) => {
      return (acc ?? 0) + (curr?.brunabotamat ?? 0)
    }, 0)

  return `${totalFireCompensation ?? 0}`
}
