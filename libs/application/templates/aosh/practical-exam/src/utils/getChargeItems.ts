import { BasicChargeItem } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

// TODO: Implement this function when we have more information
export const getChargeItems = (): Array<BasicChargeItem> => {
  return [{ code: ChargeItemCode.AOSH_STREET_REGISTRATION_SA102.toString() }]
}
