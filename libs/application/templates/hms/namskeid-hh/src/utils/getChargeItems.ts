import { Application, BasicChargeItem } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  // TODO: Update this based on actual charge items needed for namskeid-hh
  const items: Array<BasicChargeItem> = [
    {
      code: ChargeItemCode.REGISTRATION_OF_NEW_PROPERTY_NUMBERS.toString(),
      quantity: 1,
    },
  ]

  return items
}

