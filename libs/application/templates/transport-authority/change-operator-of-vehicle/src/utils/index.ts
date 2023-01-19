export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export { getChargeItemCodes } from './getChargeItemCodes'
export { getReviewSteps } from './getReviewSteps'
export { hasReviewerApproved } from './hasReviewerApproved'
export { getApproveAnswers } from './getApproveAnswers'
export { isLastReviewer } from './isLastReviewer'
export { getRejecter } from './getRejecter'
export { isRemovingOperatorOnly } from './isRemovingOperatorOnly'
