import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ChargeCodeItem,
  StaticText,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { SelectedProperty } from '../shared'

export { getIdentityData } from './getIdentityData'
export { getUserProfileData } from './getUserProfileData'
export { concatPropertyList } from './concatPropertyList'
export { getApplicationFeatureFlags } from './getApplicationFeatureFlags'

export const getChargeCodeItems = (
  application: Application,
): Array<ChargeCodeItem> => {
  return getChargeCodeItemsWithExtraLabel(application).map((item) => ({
    code: item.chargeItemCode,
    quantity: item.chargeItemQuantity,
  }))
}

export const getChargeCodeItemsWithExtraLabel = (
  application: Application,
): Array<{
  chargeItemCode: string
  chargeItemQuantity?: number
  extraLabel?: StaticText
}> => {
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

  const result: Array<{
    chargeItemCode: string
    chargeItemQuantity?: number
    extraLabel?: StaticText
  }> = []

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
