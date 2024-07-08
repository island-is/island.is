import { getValueViaPath } from '@island.is/application/core'
import { Application, StaticText } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { SelectedProperty } from '../shared'

export { getIdentityData } from './getIdentityData'
export { getUserProfileData } from './getUserProfileData'
export { concatPropertyList } from './concatPropertyList'
export { getApplicationFeatureFlags } from './getApplicationFeatureFlags'

export const getChargeItemCodes = (application: Application): Array<string> => {
  return getChargeItemCodesAndExtraLabel(application).map(
    (x) => x.chargeItemCode,
  )
}

export const getChargeItemCodesAndExtraLabel = (
  application: Application,
): Array<{ chargeItemCode: string; extraLabel?: StaticText }> => {
  const properties = getValueViaPath(
    application.answers,
    'selectedProperties.properties',
    [],
  ) as SelectedProperty[]
  const incorrectPropertiesSent = getValueViaPath(
    application.answers,
    'incorrectPropertiesSent',
    [],
  ) as SelectedProperty[]

  const result: Array<{ chargeItemCode: string; extraLabel?: StaticText }> = []

  properties
    .filter(
      (property) =>
        !incorrectPropertiesSent.find(
          (p) => p.propertyName === property.propertyName,
        ),
    )
    .map((property) => {
      result.push({
        chargeItemCode: ChargeItemCode.MORTGAGE_CERTIFICATE.toString(),
        extraLabel: `${property?.propertyName}`,
      })
    })

  return result
}
