import { TransferOfVehicleOwnership } from '../lib/dataSchema'
import { ChargeItemCode } from '@island.is/shared/constants'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export { getSelectedVehicle } from './getSelectedVehicle'
export { getReviewSteps } from './getReviewSteps'
export { getReviewerInfo } from './getReviewerInfo'
export { hasReviewerApproved } from './hasReviewerApproved'

export const getChargeItemCodes = (
  answers: TransferOfVehicleOwnership,
): Array<string> => {
  return [
    ChargeItemCode.TRANSPORT_AUTHORITY_TRANSFER_OF_VEHICLE_OWNERSHIP.toString(),
    ChargeItemCode.TRANSPORT_AUTHORITY_TRAFFIC_SAFETY_FEE.toString(),
  ]
}
