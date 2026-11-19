import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'aosh.mlr.application:name',
    defaultMessage: 'Endurnýjun vinnuvélaskírteinis',
    description: `Application's name`,
  },
  institutionName: {
    id: 'aosh.mlr.application:institution',
    defaultMessage: 'Vinnueftirlitið',
    description: `Institution's name`,
  },
  actionCardSubmitted: {
    id: 'aosh.mlr.application:actionCardSubmitted',
    defaultMessage: 'Móttekin',
    description: 'Action card tag when the application is being processed',
  },
  actionCardApproved: {
    id: 'aosh.mlr.application:actionCardApproved',
    defaultMessage: 'Samþykkt',
    description: 'Action card tag when the application has been approved',
  },
  actionCardRejected: {
    id: 'aosh.mlr.application:actionCardRejected',
    defaultMessage: 'Hafnað',
    description: 'Action card tag when the application has been rejected',
  },
  pendingActionSubmittedDescription: {
    id: 'aosh.mlr.application:pendingActionSubmittedDescription',
    defaultMessage: 'Umsóknin er í vinnslu hjá Vinnueftirlitinu.',
    description:
      'Action card description when the application is being processed',
  },
  pendingActionApprovedDescription: {
    id: 'aosh.mlr.application:pendingActionApprovedDescription',
    defaultMessage:
      'Vinnueftirlitið hefur samþykkt umsóknina og endurnýjað réttindin.',
    description:
      'Action card description when the application has been approved',
  },
  pendingActionRejectedDescription: {
    id: 'aosh.mlr.application:pendingActionRejectedDescription',
    defaultMessage:
      'Vinnueftirlitið hefur hafnað umsókninni og mun hafa samband við þig.',
    description:
      'Action card description when the application has been rejected',
  },
})
