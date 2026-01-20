import { defineMessages } from 'react-intl'

export const anPendingActionMessages = defineMessages({
  waitForReivewerAndAddAttachmentDescription: {
    id: 'an.application:pendingAction.paymentPendingDescription',
    defaultMessage: 'Þú getur bætt við aukagögnum eða fylgiskjölum á meðan',
    description: 'Pending action payment pending description',
  },
  waitingForReviewDescription: {
    id: 'an.application:pendingAction.waitingForReviewDescription',
    defaultMessage:
      'Umsóknin þín er í yfirferð. Þú getur bætt við aukagögnum eða fylgiskjölum á meðan',
    description: 'Pending action waiting for review description',
  },
})
