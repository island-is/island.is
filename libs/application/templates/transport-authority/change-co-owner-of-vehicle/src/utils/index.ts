export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export { getChargeItemCodes } from './getChargeItemCodes'
export { getSelectedVehicle } from './getSelectedVehicle'
export { hasReviewerApproved } from './hasReviewerApproved'
export { getReviewSteps } from './getReviewSteps'
export { isLastReviewer } from './isLastReviewer'
export { getApproveAnswers } from './getApproveAnswers'
export { getRejecter } from './getRejecter'
