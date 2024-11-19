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
  const allItems: ChargeCodeItem[] = getChargeCodeItemsWithExtraLabel(
    application,
  ).map((item) => ({
    code: item.chargeItemCode,
    quantity: item.chargeItemQuantity,
  }))

  //summarize items
  const summarizedItems = Object.values(
    allItems.reduce((acc, item) => {
      const quantity = item.quantity ?? 1 // Default to 1 if quantity is undefined
      if (acc[item.code]) {
        acc[item.code].quantity = (acc[item.code].quantity ?? 0) + quantity
      } else {
        acc[item.code] = { code: item.code, quantity }
      }
      return acc
    }, {} as { [key: string]: ChargeCodeItem }),
  )

  return summarizedItems
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
