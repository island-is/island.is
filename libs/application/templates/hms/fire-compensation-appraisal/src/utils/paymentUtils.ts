import { Application } from '@island.is/application/types'
import { BasicChargeItem } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
export const getCodes = (_application: Application): Array<BasicChargeItem> => {
  return [{ code: ChargeItemCode.CRIMINAL_RECORD }]
}
