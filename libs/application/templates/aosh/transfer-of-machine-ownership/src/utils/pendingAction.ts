import { Application, PendingAction } from '@island.is/application/types'
import { canReviewerApprove, getReviewers } from './hasReviewerApproved'
import { corePendingActionMessages } from '@island.is/application/core'

const getPendingReviewersText = (application: Application) => {
  const pending = getReviewers(application.answers).filter(
    (x) => !x.hasApproved,
  )
  if (pending.length === 0) return null

  const names = pending.map((x) => (x.name ? x.name : x.nationalId)).join(', ')

  return {
    ...corePendingActionMessages.whoNeedsToReviewDescription,
    values: { value: names },
  }
}

export const reviewStatePendingAction = (
  application: Application,
  nationalId: string,
): PendingAction => {
  // If the user can approve, return "you need to review" message
  if (nationalId && canReviewerApprove(nationalId, application.answers)) {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: corePendingActionMessages.youNeedToReviewDescription,
      displayStatus: 'warning',
    }
  }

  // If someone else needs to review, return message with list of name that need to review
  const pendingReviewersContent = getPendingReviewersText(application)
  if (nationalId && pendingReviewersContent) {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: pendingReviewersContent,
      displayStatus: 'info',
    }
  }

  // Return default "waiting for review" message
  return {
    title: corePendingActionMessages.waitingForReviewTitle,
    content: corePendingActionMessages.waitingForReviewDescription,
    displayStatus: 'info',
  }
}
