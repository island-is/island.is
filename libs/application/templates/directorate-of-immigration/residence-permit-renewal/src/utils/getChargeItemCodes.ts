import { ChargeItemCode } from '@island.is/shared/constants'
import { ResidencePermitRenewal } from '../lib/dataSchema'

export const getChargeItemCodes = (
  answers: ResidencePermitRenewal,
): Array<string> => {
  return [
    ChargeItemCode.DIRECTORATE_OF_IMMIGRATION_RESIDENCE_PERMIT_RENEWAL.toString(),
  ]
}
