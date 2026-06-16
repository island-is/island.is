import { Application } from '@island.is/application/types'
import * as m from '../lib/messages'
import {
  getRejectedAssigneeNames,
  getSignedAssigneeNames,
} from './assigneeUtils'

const formatAssigneeList = (names: string[]): string =>
  names.join(' \n\n * ') || '—'

export const applicantSubmitApprovedAssigneesDescription = (
  application: Application,
) => ({
  ...m.applicantSubmitMessages.infoApprovedAssigneesList,
  values: {
    names: formatAssigneeList(getSignedAssigneeNames(application)),
  },
})

export const applicantSubmitRejectedAssigneesDescription = (
  application: Application,
) => ({
  ...m.applicantSubmitMessages.infoRejectedAssigneesList,
  values: {
    names: formatAssigneeList(getRejectedAssigneeNames(application)),
  },
})
