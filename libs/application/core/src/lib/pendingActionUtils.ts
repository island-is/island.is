import { PendingAction, StaticText } from '@island.is/application/types'
import { corePendingActionMessages } from './messages'

const getPendingReviewersText = (
  reviewers: { nationalId: string; name?: string; hasApproved: boolean }[],
  whoNeedsToReviewDescription?: StaticText,
) => {
  const pendingReviewers = reviewers.filter((x) => !x.hasApproved)
  if (pendingReviewers.length === 0) return null

  const names = pendingReviewers
    .map((x) => (x.name ? x.name : x.nationalId))
    .join(', ')

  if (typeof whoNeedsToReviewDescription === 'string') {
    return whoNeedsToReviewDescription
  }

  return {
    ...(whoNeedsToReviewDescription ??
      corePendingActionMessages.whoNeedsToReviewDescription),
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
 * @param shouldShowReviewerList - whether to display a list of reviewers who have not yet approved
 * @param customMessages - optional custom messages to override default pending action messages:
 *   - waitingForReviewTitle: title for the pending review message
 *   - youNeedToReviewDescription: text shown if the current user needs to review
 *   - whoNeedsToReviewDescription: text for the list of pending reviewers;
 *       if provided as a string instead of a text object, the list of reviewer names will not be appended
 *   - waitingForReviewDescription: default text shown if no one needs to review or reviewer list is hidden
 * @returns a message telling the user to review if they need to, otherwise a list of reviewers yet to review.
 */
export const getReviewStatePendingAction = (
  currentUserNationalId: string,
  reviewers: { nationalId: string; name?: string; hasApproved: boolean }[],
  shouldShowReviewerList: boolean,
  customMessages?: {
    waitingForReviewTitle?: StaticText
    youNeedToReviewDescription?: StaticText
    whoNeedsToReviewDescription?: StaticText
    waitingForReviewDescription?: StaticText
  },
): PendingAction => {
  // If the current user needs to review, return "you need to review" message
  if (isCurrentUserReviewPending(currentUserNationalId, reviewers)) {
    return {
      title:
        customMessages?.waitingForReviewTitle ??
        corePendingActionMessages.waitingForReviewTitle,
      content:
        customMessages?.youNeedToReviewDescription ??
        corePendingActionMessages.youNeedToReviewDescription,
      displayStatus: 'warning',
    }
  }

  // If shouldShowReviewerList is true and the current user does not have a pending review,
  // and there are reviewers who have not yet approved, return a message listing those reviewers
  if (shouldShowReviewerList) {
    const pendingReviewersContent = getPendingReviewersText(
      reviewers,
      customMessages?.whoNeedsToReviewDescription,
    )
    if (pendingReviewersContent) {
      return {
        title:
          customMessages?.waitingForReviewTitle ??
          corePendingActionMessages.waitingForReviewTitle,
        content: pendingReviewersContent,
        displayStatus: 'info',
      }
    }
  }

  // Default "Waiting for review" message
  return {
    title:
      customMessages?.waitingForReviewTitle ??
      corePendingActionMessages.waitingForReviewTitle,
    content:
      customMessages?.waitingForReviewDescription ??
      corePendingActionMessages.waitingForReviewDescription,
    displayStatus: 'info',
  }
}
