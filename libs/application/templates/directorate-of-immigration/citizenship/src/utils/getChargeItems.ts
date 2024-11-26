import { BasicChargeItem } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItems = (): Array<BasicChargeItem> => {
  return [
    { code: ChargeItemCode.DIRECTORATE_OF_IMMIGRATION_CITIZENSHIP.toString() },
  ]
}
