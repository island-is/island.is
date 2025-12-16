import { Application, BasicChargeItem } from '@island.is/application/types'
import { CHARGE_ITEM_CODES } from '../lib/constants'

export const getChargeItems = (
  _application: Application,
): Array<BasicChargeItem> => {
  // Currently returns a single charge code for undivided estate
  // The _application parameter is included for future flexibility
  // (e.g., different estate types may have different fees)
  return [{ code: CHARGE_ITEM_CODES.UNDIVIDED_ESTATE }]
}
