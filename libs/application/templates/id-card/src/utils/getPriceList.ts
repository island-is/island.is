import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { PaymentItem } from '../lib/constants'

export const getPriceList = (application: Application) => {
  const applicationPrices = getValueViaPath(
    application.externalData,
    'payment.data',
    [],
  ) as Array<PaymentItem>

  const regularPrice = applicationPrices.find(
    (x) => x.chargeItemCode === ChargeItemCode.ID_CARD_REGULAR.toString(),
  )
  const regularDiscountPrice = applicationPrices.find(
    (x) =>
      x.chargeItemCode === ChargeItemCode.ID_CARD_OTHERS_REGULAR.toString(),
  )
  const fastPrice = applicationPrices.find(
    (x) => x.chargeItemCode === ChargeItemCode.ID_CARD_EXPRESS.toString(),
  )
  const fastDiscountPrice = applicationPrices.find(
    (x) =>
      x.chargeItemCode === ChargeItemCode.ID_CARD_OTHERS_EXPRESS.toString(),
  )

  return {
    regularPrice,
    regularDiscountPrice,
    fastPrice,
    fastDiscountPrice,
  }
}
