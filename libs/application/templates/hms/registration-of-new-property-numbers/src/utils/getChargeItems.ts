import { getValueViaPath } from '@island.is/application/core'
import { Application, BasicChargeItem } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const amount = getValueViaPath<string>(
    application.answers,
    'realEstate.realEstateAmount',
  )

  const items: Array<BasicChargeItem> = [
    {
      code: ChargeItemCode.REGISTRATION_OF_NEW_PROPERTY_NUMBERS.toString(),
      quantity: Number(amount),
    },
  ]

  return items
}
