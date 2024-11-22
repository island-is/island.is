import { LicensePlateRenewal } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'
import {
  Application,
  BasicChargeItem,
  ExtraData,
} from '@island.is/application/types'
import { isPaymentRequired } from './isPaymentRequired'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const paymentRequired = isPaymentRequired({ application })
  return paymentRequired
    ? [
        {
          code: ChargeItemCode.TRANSPORT_AUTHORITY_LICENSE_PLATE_RENEWAL.toString(),
        },
      ]
    : []
}

export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as LicensePlateRenewal
  return [{ name: 'vehicle', value: answers?.pickPlate?.regno }]
}

export { getSelectedVehicle } from './getSelectedVehicle'
export { checkCanRenew } from './checkCanRenew'
