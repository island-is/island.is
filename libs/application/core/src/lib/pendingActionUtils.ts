import { PendingAction } from '@island.is/application/types'
import { corePendingActionMessages } from './messages'

const getPendingReviewersText = (
  reviewers: { nationalId: string; name: string; hasApproved: boolean }[],
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

export const getReviewStatePendingAction = (
  canReviewerApprove: boolean,
  reviewers: { nationalId: string; name: string; hasApproved: boolean }[],
): PendingAction => {
  // If the user can approve, return "you need to review" message
  if (canReviewerApprove) {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: corePendingActionMessages.youNeedToReviewDescription,
      displayStatus: 'warning',
    }
  }

  // If someone else needs to review, return message with list of reviewers that need to review
  const pendingReviewersContent = getPendingReviewersText(reviewers)
  if (pendingReviewersContent) {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: pendingReviewersContent,
      displayStatus: 'info',
    }
  }

  // Default "waiting for review" message
  return {
    title: corePendingActionMessages.waitingForReviewTitle,
    content: corePendingActionMessages.waitingForReviewDescription,
    displayStatus: 'info',
  }
}
