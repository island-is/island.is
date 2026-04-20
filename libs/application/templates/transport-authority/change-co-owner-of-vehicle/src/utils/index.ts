import { parsePhoneNumberFromString } from 'libphonenumber-js'

export {
  getChargeItems,
  getChargeItemsWithAnswers,
  getExtraData,
} from './getChargeItems'
export { getSelectedVehicle } from './getSelectedVehicle'
export { getReviewSteps } from './getReviewSteps'
export { isLastReviewer } from './isLastReviewer'
export { getApproveAnswers } from './getApproveAnswers'
export { getRejecter } from './getRejecter'
export { formatMileage } from './formatMileage'
export * from './getReviewers'

export const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return ''
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}
