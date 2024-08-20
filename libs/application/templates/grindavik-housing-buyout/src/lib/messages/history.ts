import { defineMessages } from 'react-intl'

export const historyLogs = defineMessages({
  inReviewHistoryLog: {
    id: 'ghb.application:history.inReview.log',
    defaultMessage: 'Umsókn send inn',
    description: 'History log when application has been set to in review',
  },
  sentToThorkatla: {
    id: 'ghb.application:history.sentToThorkatla.log',
    defaultMessage: 'Umsókn send til Þórkötlu',
    description: 'History log when application has been sent to Þorkatla',
  },
  approvedByThorkatla: {
    id: 'ghb.application:history.approvedByThorkatla.log',
    defaultMessage: 'Umsókn samþykkt af Þórkötlu',
    description: 'History log when application has been approved by Þorkatla',
  },
  purchaseAgreementSentForSigning: {
    id: 'ghb.application:history.purchaseAgreementSentForSigning.log',
    defaultMessage: 'Kaupsamningur sendur í undirritun',
    description:
      'History log when purchase agreement has been sent for signing',
  },
  purchaseAgreementReceivedFromSigning: {
    id: 'ghb.application:history.purchaseAgreementReceivedFromSigning.log',
    defaultMessage: 'Kaupsamningur móttekinn úr undirritun',
    description:
      'History log when purchase agreement has been received from signing',
  },
  purchaseAgreementDeclared: {
    id: 'ghb.application:history.purchaseAgreementDeclared.log',
    defaultMessage: 'Kaupsamningur Þinglýstur',
    description: 'History log when purchase agreement has been declared',
  },
  paidOut: {
    id: 'ghb.application:history.paidOut.log',
    defaultMessage: 'Greitt út',
    description: 'History log when payment has been made',
  },
})
