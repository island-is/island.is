import { Application } from '@island.is/application/types'
import { defineMessages } from 'react-intl'
import {
  getRejectedAssigneeNames,
  getSignedAssigneeNames,
} from './assigneeUtils'

export const applicantSubmitRejectedInfoMessages = defineMessages({
  infoRejectedAlertTitle: {
    id: 'hb.application:applicantSubmit.infoRejectedAlertTitle',
    defaultMessage: 'Ekki allir heimilismenn samþykktu',
    description: 'Info screen alert title when an assignee rejected',
  },
  infoRejectedAlertMessage: {
    id: 'hb.application:applicantSubmit.infoRejectedAlertMessage',
    defaultMessage:
      'Einn eða fleiri heimilismenn hafa hafnað umsókninni. Sjá nánar hér að neðan.',
    description: 'Info screen alert message when an assignee rejected',
  },
  infoApprovedAssigneesList: {
    id: 'hb.application:applicantSubmit.infoApprovedAssigneesList#markdown',
    defaultMessage: 'Heimilismenn sem samþykktu umsóknina: \n\n * {names}',
    description:
      'List of household assignees who approved on applicant submit info screen',
  },
  infoRejectedAssigneesList: {
    id: 'hb.application:applicantSubmit.infoRejectedAssigneesList#markdown',
    defaultMessage: 'Heimilismenn sem höfnuðu umsókninni: \n\n * {names}',
    description:
      'List of household assignees who rejected on applicant submit info screen',
  },
})

const formatAssigneeList = (names: string[]): string =>
  names.join(' \n\n * ') || '—'

export const applicantSubmitApprovedAssigneesDescription = (
  application: Application,
) => ({
  ...applicantSubmitRejectedInfoMessages.infoApprovedAssigneesList,
  values: {
    names: formatAssigneeList(getSignedAssigneeNames(application)),
  },
})

export const applicantSubmitRejectedAssigneesDescription = (
  application: Application,
) => ({
  ...applicantSubmitRejectedInfoMessages.infoRejectedAssigneesList,
  values: {
    names: formatAssigneeList(getRejectedAssigneeNames(application)),
  },
})
