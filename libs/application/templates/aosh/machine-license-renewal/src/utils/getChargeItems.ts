import { BasicChargeItem } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItems = (): Array<BasicChargeItem> => [
  { code: ChargeItemCode.AOSH_MACHINE_LICENSE_RENEWAL, quantity: 1 },
]
