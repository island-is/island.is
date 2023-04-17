import { ChargeItemCode } from '@island.is/shared/constants'
import { Citizenship } from '../lib/dataSchema'

export const getChargeItemCodes = (answers: Citizenship): Array<string> => {
  return [ChargeItemCode.DIRECTORATE_OF_IMMIGRATION_CITIZENSHIP.toString()]
}
