import { DigitalTachographDriversCard } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const getChargeItemCodes = (
  answers: DigitalTachographDriversCard,
): Array<string> => {
  const result = []

  if (!answers.deliveryMethodIsSend) {
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
