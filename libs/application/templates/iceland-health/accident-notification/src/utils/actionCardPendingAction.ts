import { Application } from '@island.is/application/types'
import { PendingAction } from '@island.is/application/types'
import { Roles } from './enums'
import { corePendingActionMessages } from '@island.is/application/core'
import { anPendingActionMessages } from '../lib/messages/actionCards'

export const assignStatePendingAction = (
  application: Application,
  role: string,
): PendingAction => {
  if (role === Roles.ASSIGNEE) {
    return {
      title: corePendingActionMessages.waitingForAssigneeTitle,
      content: corePendingActionMessages.waitingForAssigneeDescription,
      displayStatus: 'warning',
    }
  } else {
    return {
      title: corePendingActionMessages.waitingForAssigneeTitle,
      content:
        anPendingActionMessages.waitForReivewerAndAddAttachmentDescription,
      displayStatus: 'info',
    }
  }
}

export const reviewStatePendingAction = (
  _application: Application,
  role: string,
): PendingAction => {
  if (role === Roles.ASSIGNEE) {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: corePendingActionMessages.waitingForAssigneeDescription,
      displayStatus: 'warning',
    }
  } else {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: corePendingActionMessages.youNeedToReviewDescription,
      displayStatus: 'info',
    }
  }
}
