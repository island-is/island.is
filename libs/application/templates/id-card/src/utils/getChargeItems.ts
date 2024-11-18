import { getValueViaPath } from '@island.is/application/core'
import { Application, ChargeCodeItem } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { Routes } from '../lib/constants'
import { checkForDiscount } from './hasDiscount'
import { Services } from '../shared/types'

export const getChargeCodeItems = (
  application: Application,
): Array<ChargeCodeItem> => {
  const chosenPaymentForm = getValueViaPath(
    application.answers,
    `${Routes.PRICELIST}.priceChoice`,
  )
  const hasDiscount = checkForDiscount(application)
  if (chosenPaymentForm === Services.REGULAR && !hasDiscount) {
    return [{ code: ChargeItemCode.ID_CARD_REGULAR.toString() }]
  } else if (chosenPaymentForm === Services.REGULAR && hasDiscount) {
    return [{ code: ChargeItemCode.ID_CARD_OTHERS_REGULAR.toString() }]
  } else if (chosenPaymentForm === Services.EXPRESS && !hasDiscount) {
    return [{ code: ChargeItemCode.ID_CARD_EXPRESS.toString() }]
  } else if (chosenPaymentForm === Services.EXPRESS && hasDiscount) {
    return [{ code: ChargeItemCode.ID_CARD_OTHERS_EXPRESS.toString() }]
  }
  return []
}
