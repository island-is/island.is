import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { Routes, Services } from '../lib/constants'
import { isChild } from './isChild'

export const getChargeItemCodes = (application: Application): Array<string> => {
  const chosenPaymentForm = getValueViaPath(
    application.answers,
    `${Routes.PRICELIST}.priceChoice`,
  )
  if (chosenPaymentForm === Services.REGULAR) {
    return [ChargeItemCode.ID_CARD_REGULAR.toString()]
  }
  // if (chosenPaymentForm === Services.REGULAR_DISCOUNT) {
  //   return [ChargeItemCode.ID_CARD_DISCOUNT_REGULAR.toString()]
  // }
  if (chosenPaymentForm === Services.EXPRESS) {
    return [ChargeItemCode.ID_CARD_EXPRESS.toString()]
  }
  // if (chosenPaymentForm === Services.EXPRESS_DISCOUNT) {
  //   return [ChargeItemCode.ID_CARD_DISCOUNT_EXPRESS.toString()]
  // }
  return []
}

const isUnderAge = (application: Application, age: number) => {
  if (age < 18) return true

  const applicantIsApplyingForChild = isChild(
    application.answers,
    application.externalData,
  )

  return applicantIsApplyingForChild
}
