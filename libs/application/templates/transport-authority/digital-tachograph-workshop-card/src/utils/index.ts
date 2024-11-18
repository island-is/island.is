import { ChargeCodeItem } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeCodeItems = (): Array<ChargeCodeItem> => {
  return [
    {
      code: ChargeItemCode.TRANSPORT_AUTHORITY_DIGITAL_TACHOGRAPH_WORKSHOP_CARD,
    },
  ]
}
