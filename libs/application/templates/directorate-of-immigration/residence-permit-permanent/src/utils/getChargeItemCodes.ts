import { ChargeItemCode } from '@island.is/shared/constants'
import { ResidencePermitPermanent } from '../lib/dataSchema'

export const getChargeItemCodes = (
  answers: ResidencePermitPermanent,
): Array<string> => {
  return [
    ChargeItemCode.DIRECTORATE_OF_IMMIGRATION_RESIDENCE_PERMIT_PERMANENT.toString(),
  ]
}
