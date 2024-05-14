import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItemCodes = (): Array<string> => {
  return [ChargeItemCode.ID_CARD_REGULAR.toString()] // todo connect to chosen option
}
