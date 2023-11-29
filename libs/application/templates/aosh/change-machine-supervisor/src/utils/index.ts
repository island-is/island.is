export const formatPhoneNumber = (value: string): string =>
  value.length === 7 ? value.substr(0, 3) + '-' + value.substr(3, 6) : value

export { getChargeItemCodes } from './getChargeItemCodes'
export { getReviewSteps } from './getReviewSteps'
export { hasReviewerApproved } from './hasReviewerApproved'
export { getApproveAnswers } from './getApproveAnswers'
export { isLastReviewer } from './isLastReviewer'
export { getRejecter } from './getRejecter'
export { isRemovingOperatorOnly } from './isRemovingOperatorOnly'
