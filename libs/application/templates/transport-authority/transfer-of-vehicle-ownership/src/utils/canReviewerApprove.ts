import { FormValue } from '@island.is/application/types'
import { applicationHasPendingApproval } from './isLastReviewer'
import { getReviewers } from './getReviewers'

// Function to check if the reviewer is authorized to approve and hasn't done that yet
export const canReviewerApprove = (
  reviewerNationalId: string,
  answers: FormValue,
): boolean => {
  const reviewers = getReviewers(answers)

  const reviewer = reviewers.find((x) => x.nationalId === reviewerNationalId)

  return reviewer !== undefined && reviewer.hasApproved === false
}

// Special case to allow seller (or any reviewer) to trigger an external API call to complete owner change
// Necessary when approve is updated in answers, but application is still stuck in REVIEW state
// then any user can try to 'push' the application to the next state
export const canReviewerReApprove = (
  reviewerNationalId: string,
  answers: FormValue,
): boolean => {
  const reviewers = getReviewers(answers)

  // Check if this national ID is one of the reviewers
  const isReviewerAuthorized = reviewers.some(
    (x) => x.nationalId === reviewerNationalId,
  )

  // Allowed only when all approvals are completed
  return isReviewerAuthorized && !applicationHasPendingApproval(answers)
}
