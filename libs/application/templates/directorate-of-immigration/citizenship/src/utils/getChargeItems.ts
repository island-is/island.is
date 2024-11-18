import { ChargeCodeItem } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeCodeItems = (): Array<ChargeCodeItem> => {
  return [
    { code: ChargeItemCode.DIRECTORATE_OF_IMMIGRATION_CITIZENSHIP.toString() },
  ]
}
