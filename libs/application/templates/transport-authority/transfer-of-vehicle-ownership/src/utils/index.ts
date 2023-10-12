import { ChargeItemCode } from '@island.is/shared/constants'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const formatMileage = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export const formatPhoneNumber = (value: string): string =>
  value.length === 7 ? value.substr(0, 3) + '-' + value.substr(3, 6) : value

export { getSelectedVehicle } from './getSelectedVehicle'
export { getReviewSteps } from './getReviewSteps'
export { hasReviewerApproved } from './hasReviewerApproved'
export { getApproveAnswers } from './getApproveAnswers'
export { isLastReviewer } from './isLastReviewer'
export { getRejecter } from './getRejecter'

export const getChargeItemCodes = (): Array<string> => {
  return [
    ChargeItemCode.TRANSPORT_AUTHORITY_TRANSFER_OF_VEHICLE_OWNERSHIP.toString(),
    ChargeItemCode.TRANSPORT_AUTHORITY_TRAFFIC_SAFETY_FEE.toString(),
  ]
}
