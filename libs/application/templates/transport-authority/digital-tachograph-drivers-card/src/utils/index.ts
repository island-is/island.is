import { DigitalTachographDriversCard } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'
import {
  Application,
  BasicChargeItem,
  ExternalData,
} from '@island.is/application/types'
import { getValueViaPath, YES } from '@island.is/application/core'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const answers = application.answers as DigitalTachographDriversCard
  return getChargeItemsWithAnswers(answers)
}

export const getChargeItemsWithAnswers = (
  answers: DigitalTachographDriversCard,
): Array<BasicChargeItem> => {
  const result: Array<BasicChargeItem> = []

  const deliveryMethodIsSend =
    answers.cardDelivery?.deliveryMethodIsSend === YES

  if (!deliveryMethodIsSend) {
    result.push({
      code: ChargeItemCode.TRANSPORT_AUTHORITY_DIGITAL_TACHOGRAPH_DRIVERS_CARD.toString(),
    })
  } else {
    result.push({
      code: ChargeItemCode.TRANSPORT_AUTHORITY_DIGITAL_TACHOGRAPH_DRIVERS_CARD_WITH_SHIPPING.toString(),
    })
  }

  return result
}

export const newestCardExists = (externalData: ExternalData) => {
  const cardNumber = getValueViaPath(
    externalData,
    'newestDriversCard.data.cardNumber',
    '',
  ) as string
  return !!cardNumber
}

export const newestCardIsValid = (externalData: ExternalData) => {
  const isValid = getValueViaPath(
    externalData,
    'newestDriversCard.data.isValid',
    false,
  ) as boolean
  return isValid
}

export const newestCardIsExpired = (externalData: ExternalData) => {
  const cardValidTo = getValueViaPath(
    externalData,
    'newestDriversCard.data.cardValidTo',
    '',
  ) as string
  const today = new Date()
  today.setHours(0, 0, 0)
  return new Date(cardValidTo) < today
}

export const newestCardExpiresInMonths = (externalData: ExternalData) => {
  const cardValidTo = getValueViaPath(
    externalData,
    'newestDriversCard.data.cardValidTo',
    '',
  ) as string

  return getDayDiff(new Date(), new Date(cardValidTo)) / 30
}

const getDayDiff = (date1: Date, date2: Date) => {
  const diff = Math.abs(date1.getTime() - date2.getTime())
  return Math.ceil(diff / (1000 * 3600 * 24))
}
