import { Application } from '@island.is/application/types'
import * as m from '../lib/messages'
import {
  getSignedApprovalNames,
  getUnsignedApprovalNames,
} from './assigneeUtils'

export const assigneeWaitingApprovedDescription = (application: Application) => ({
  ...m.assigneeWaiting.approvedList,
  values: {
    names: getSignedApprovalNames(application).join(' \n\n * ') || '—',
  },
})

export const assigneeWaitingPendingDescription = (application: Application) => ({
  ...m.assigneeWaiting.pendingList,
  values: {
    names: getUnsignedApprovalNames(application).join(' \n\n * ') || '—',
  },
})
