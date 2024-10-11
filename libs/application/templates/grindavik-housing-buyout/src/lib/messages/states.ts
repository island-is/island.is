import { defineMessages } from 'react-intl'

export const states = defineMessages({
  inReviewTitle: {
    id: 'ghb.application:states.inReview.title',
    defaultMessage: 'Umsókn móttekin',
    description: 'Title that displays on action card when in review',
  },
  inReviewDescription: {
    id: 'ghb.application:states.inReview.description',
    defaultMessage:
      'Umsókn þín um kaup ríkisins á íbúðarhúsnæði þínu er móttekin.',
    description: 'Description that displays on action card when in review',
  },
  approvedTitle: {
    id: 'ghb.application:states.approved.title',
    defaultMessage: 'Umsókn samþykkt',
    description:
      'Title that displays on action card when application is approved',
  },
  approvedText: {
    id: 'ghb.application:states.approved.text',
    defaultMessage: 'Umsókn þín hefur verið samþykkt.',
    description: 'Text that displays when application is approved',
  },
  rejectedTitle: {
    id: 'ghb.application:states.rejected.title',
    defaultMessage: 'Umsókn hafnað',
    description:
      'Title that displays on action card when application is rejected',
  },
  rejectedText: {
    id: 'ghb.application:states.rejected.text',
    defaultMessage: 'Umsókn þinni hefur verið hafnað.',
    description: 'Text that displays when application is rejected',
  },
  sentToThorkatlaTitle: {
    id: 'ghb.application:states.sentToThorkatla.title',
    defaultMessage: 'Umsóknin er í vinnslu hjá Þórkötlu',
    description: 'Title that displays on action card when sent to Þórkötla',
  },
  sentToThorkatlaDescription: {
    id: 'ghb.application:states.sentToThorkatla.description',
    defaultMessage:
      'Umsóknin hefur verið send til Þórkötlun og vinnsla er hafin þar.',
    description:
      'Description that displays on action card when sent to Þórkötla',
  },
  approvedByThorkatlaTitle: {
    id: 'ghb.application:states.approvedByThorkatla.title',
    defaultMessage: 'Umsókn samþykkt af Þórkötlu',
    description: 'Title that displays on action card when approved by Þórkötla',
  },
  approvedByThorkatlaDescription: {
    id: 'ghb.application:states.approvedByThorkatla.description',
    defaultMessage: 'Umsóknin hefur verið samþykkt af Þórkötlu.',
    description:
      'Description that displays on action card when approved by Þórkötla',
  },
  purchaseAgreementSentForSigningTitle: {
    id: 'ghb.application:states.purchaseAgreementSentForSigning.title',
    defaultMessage: 'Kaupsamningur sendur í undirritun',
    description:
      'Title that displays on action card when purchase agreement is sent for signing',
  },
  purchaseAgreementSentForSigningDescription: {
    id: 'ghb.application:states.purchaseAgreementSentForSigning.description',
    defaultMessage: 'Kaupsamningur sendur í undirritun.',
    description:
      'Description that displays on action card when purchase agreement is sent for signing',
  },
  purchaseAgreementReceivedFromSigningTitle: {
    id: 'ghb.application:states.purchaseAgreementReceivedFromSigning.title',
    defaultMessage: 'Kaupsamningur móttekinn úr undirritun',
    description:
      'Title that displays on action card when purchase agreement is received from signing',
  },
  purchaseAgreementReceivedFromSigningDescription: {
    id: 'ghb.application:states.purchaseAgreementReceivedFromSigning.description',
    defaultMessage: 'Kaupsamningur móttekinn úr undirritun.',
    description:
      'Description that displays on action card when purchase agreement is received from signing',
  },
  purchaseAgreementDeclaredTitle: {
    id: 'ghb.application:states.purchaseAgreementDeclared.title',
    defaultMessage: 'Kaupsamningur Þinglýstur',
    description:
      'Title that displays on action card when purchase agreement is declared',
  },
  purchaseAgreementDeclaredDescription: {
    id: 'ghb.application:states.purchaseAgreementDeclared.description',
    defaultMessage: 'Kaupsamningur hefur verið þinglýstur.',
    description:
      'Description that displays on action card when purchase agreement is declared',
  },
  paidOutTitle: {
    id: 'ghb.application:states.paidOut.title',
    defaultMessage: 'Greitt út',
    description: 'Title that displays on action card when paid out',
  },
  paidOutDescription: {
    id: 'ghb.application:states.paidOut.description',
    defaultMessage: 'Samningur hefur verið greiddur út.',
    description: 'Description that displays on action card when paid out',
  },
})
