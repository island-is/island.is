import { FormValue } from '@island.is/application/types'
import { getReviewers } from './getReviewers'

const applicationHasPendingApproval = (
  answers: FormValue,
  excludeNationalId?: string,
): boolean => {
  const reviewers = getReviewers(answers)

  return reviewers.some(
    ({ nationalId, hasApproved }) =>
      nationalId !== excludeNationalId && !hasApproved,
  )
}

// Function to check if the current reviewer is the last one who needs to approve
export const isLastReviewer = (
  reviewerNationalId: string,
  answers: FormValue,
): boolean => {
  // If there are pending approvals (excluding current reviewer), then he is not the last reviewer
  if (applicationHasPendingApproval(answers, reviewerNationalId)) return false

  // Otherwise, the only review missing is from the current reviewer
  return true
}
