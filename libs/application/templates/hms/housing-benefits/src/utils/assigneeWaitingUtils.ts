import { Application } from '@island.is/application/types'
import * as m from '../lib/messages'
import {
  getRejectedAssigneeNames,
  getSignedApprovalNames,
  getUnsignedApprovalNames,
  getApplicantName,
} from './assigneeUtils'

export const assigneeWaitingApprovedDescription = (
  application: Application,
) => ({
  ...m.assigneeWaiting.approvedList,
  values: {
    names:
      getSignedApprovalNames(application)
        .map((name) => `* ${name}`)
        .join('\n\n') || '—',
  },
})

export const assigneeWaitingPendingDescription = (
  application: Application,
) => ({
  ...m.assigneeWaiting.pendingList,
  values: {
    names:
      getUnsignedApprovalNames(application)
        .map((name) => `* ${name}`)
        .join('\n\n') || '—',
  },
})

export const assigneeWaitingRejectedDescription = (
  application: Application,
) => ({
  ...m.assigneeWaiting.rejectedList,
  values: {
    names:
      getRejectedAssigneeNames(application)
        .map((name) => `* ${name}`)
        .join('\n\n') || '—',
  },
})

export const assigneeWaitingIntroDescription = (application: Application) => ({
  ...m.assigneeWaiting.introDescription,
  values: {
    applicantName: getApplicantName(application),
  },
})
