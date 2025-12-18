import { PendingAction } from '@island.is/application/types'
import { corePendingActionMessages } from './messages'

const getPendingReviewersText = (
  reviewers: { nationalId: string; name?: string; hasApproved: boolean }[],
) => {
  const pendingReviewers = reviewers.filter((x) => !x.hasApproved)
  if (pendingReviewers.length === 0) return null

  const names = pendingReviewers
    .map((x) => (x.name ? x.name : x.nationalId))
    .join(', ')

  return {
    ...corePendingActionMessages.whoNeedsToReviewDescription,
    values: { value: names },
  }
}

const isCurrentUserReviewPending = (
  currentUserNationalId: string,
  reviewers: { nationalId: string; name?: string; hasApproved: boolean }[],
) => {
  const currentReviewer = reviewers.find(
    (x) => x.nationalId === currentUserNationalId,
  )
  return currentReviewer?.hasApproved === false
}

/**
 *
 * @param currentUserNationalId - nationalId of the currently logged-in user
 * @param reviewers - array of all reviewers for this state, if the reviewer has approved reviewer.hasApproved must be TRUE
 * @returns a message telling the user to review if they need to, otherwise a list of reviewers yet to review.
 */
export const getReviewStatePendingAction = (
  currentUserNationalId: string,
  reviewers: { nationalId: string; name?: string; hasApproved: boolean }[],
): PendingAction => {
  // If the current user needs to review, return "you need to review" message
  if (isCurrentUserReviewPending(currentUserNationalId, reviewers)) {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: corePendingActionMessages.youNeedToReviewDescription,
      displayStatus: 'warning',
    }
  }

  // If the current user either has reviewed or their review isn't needed and some reviewer(s) need to review
  // return message with list of reviewers that need to review
  const pendingReviewersContent = getPendingReviewersText(reviewers)
  if (pendingReviewersContent) {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: pendingReviewersContent,
      displayStatus: 'info',
    }
  }

  // Should only reach here if application is in review state and no reviewers
  // are yet to review indicating some sort of error. Since we can't know why the application is still in review state
  // we return a generic "waiting for review" message.
  return {
    title: corePendingActionMessages.waitingForReviewTitle,
    content: corePendingActionMessages.waitingForReviewDescription,
    displayStatus: 'info',
  }
}
