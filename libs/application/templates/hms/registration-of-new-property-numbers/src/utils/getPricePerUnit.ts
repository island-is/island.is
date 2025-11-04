import { getValueViaPath } from '@island.is/application/core'
import { Application, PaymentCatalogItem } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getPricePerUnit = (application: Application) => {
  const costPerNewProperty = (
    getValueViaPath<PaymentCatalogItem[]>(
      application.externalData,
      'payment.data',
    ) || []
  ).find(
    (item) =>
      item.chargeItemCode ===
      ChargeItemCode.REGISTRATION_OF_NEW_PROPERTY_NUMBERS,
  )?.priceAmount
  return costPerNewProperty
}
