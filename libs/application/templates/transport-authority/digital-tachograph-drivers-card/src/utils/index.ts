import { DigitalTachographDriversCard } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'
import { Application, ExternalData } from '@island.is/application/types'
import { getValueViaPath, YES } from '@island.is/application/core'

export const getChargeItemCodes = (application: Application): Array<string> => {
  const answers = application.answers as DigitalTachographDriversCard
  return getChargeItemCodeWithAnswers(answers)
}

export const getChargeItemCodeWithAnswers = (
  answers: DigitalTachographDriversCard,
): Array<string> => {
  const result: Array<string> = []

  const deliveryMethodIsSend =
    answers.cardDelivery?.deliveryMethodIsSend === YES

  if (!deliveryMethodIsSend) {
    result.push(
      ChargeItemCode.TRANSPORT_AUTHORITY_DIGITAL_TACHOGRAPH_DRIVERS_CARD.toString(),
    )
  } else {
    result.push(
      ChargeItemCode.TRANSPORT_AUTHORITY_DIGITAL_TACHOGRAPH_DRIVERS_CARD_WITH_SHIPPING.toString(),
    )
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
