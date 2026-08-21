import { expr, getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormExpression,
  FormValue,
} from '@island.is/application/types'
import { getSelectedProperty } from './propertyUtils'

export const sumUsageUnitsFireCompensation = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const usageUnits = getValueViaPath<Array<string>>(answers, 'usageUnits')

  const property = getSelectedProperty(answers, externalData)

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

/**
 * Client-evaluable equivalent of `sumUsageUnitsFireCompensation`. The brunabótamat
 * amounts live in `externalData`, which client expressions cannot read — so we bake
 * each unit's number + amount in as literals at screen-build time and gate them on
 * `usageUnits` (the checkbox answer the client *can* read). The result updates with
 * zero latency as units are toggled; the selected property's units are fixed, so the
 * tree only needs rebuilding when the property changes (handled by the select REFETCH).
 */
export const usageUnitsFireCompensationClientExpression = (
  answers: FormValue,
  externalData: ExternalData,
): FormExpression => {
  const units =
    getSelectedProperty(answers, externalData)?.notkunareiningar
      ?.notkunareiningar ?? []

  return expr.sum(
    ...units.map((unit) =>
      expr.if({
        condition: expr.contains(
          expr.get('usageUnits'),
          unit.notkunareininganumer ?? '',
        ),
        then: unit.brunabotamat ?? 0,
        otherwise: 0,
      }),
    ),
  )
}

export const totalFireCompensation = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const property = getSelectedProperty(answers, externalData)

  const totalFireCompensation =
    property?.notkunareiningar?.notkunareiningar?.reduce((acc, curr) => {
      return (acc ?? 0) + (curr?.brunabotamat ?? 0)
    }, 0)

  return `${totalFireCompensation ?? 0}`
}
