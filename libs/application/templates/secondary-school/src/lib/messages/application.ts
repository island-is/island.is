import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'ss.application:name',
    defaultMessage: 'Umsókn um framhaldsskóla',
    description: `Application's name`,
  },
  institutionName: {
    id: 'ss.application:institution',
    defaultMessage: 'Miðstöð menntunar og skólaþjónustu',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'ss.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'ss.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in draft',
  },
  actionCardEdit: {
    id: 'ss.application:actionCardEdit',
    defaultMessage: 'Í vinnslu (áður innsend)',
    description:
      'Description of application state/status when the application is in edit',
  },
  actionCardSubmitted: {
    id: 'ss.application:actionCardSubmitted',
    defaultMessage: 'Innsend',
    description:
      'Description of application state/status when application is submitted',
  },
  actionCardInReview: {
    id: 'ss.application:actionCardInReview',
    defaultMessage: 'Í vinnslu hjá stofnun',
    description:
      'Description of application state/status when application is completed',
  },
  actionCardCompleted: {
    id: 'ss.application:actionCardCompleted',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is completed',
  },
  actionCardDismissed: {
    id: 'ss.application:actionCardDismissed',
    defaultMessage: 'Vísað frá',
    description:
      'Description of application state/status when application is dismissed',
  },
  stateMetaNamePrerequisites: {
    id: 'ss.application:stateMetaNamePrerequisites',
    defaultMessage: 'Prerequisites',
    description:
      'Meta name of application state when the application is in prerequisites',
  },
  stateMetaNameDraft: {
    id: 'ss.application:stateMetaNameDraft',
    defaultMessage: 'Draft',
    description:
      'Meta name of application state when the application is in draft',
  },
  stateMetaNameEdit: {
    id: 'ss.application:stateMetaNameEdit',
    defaultMessage: 'Edit',
    description:
      'Meta name of application state when the application is in edit',
  },
  stateMetaNameSubmitted: {
    id: 'ss.application:stateMetaNameSubmitted',
    defaultMessage: 'Submitted',
    description:
      'Meta name of application state when the application is in submitted',
  },
  stateMetaNameInReview: {
    id: 'ss.application:stateMetaNameInReview',
    defaultMessage: 'In review',
    description:
      'Meta name of application state when the application is in review',
  },
  stateMetaNameCompleted: {
    id: 'ss.application:stateMetaNameCompleted',
    defaultMessage: 'Completed',
    description:
      'Meta name of application state when the application is in completed',
  },
  stateMetaNameDismissed: {
    id: 'ss.application:stateMetaNameDismissed',
    defaultMessage: 'Dismissed',
    description:
      'Meta name of application state when the application is in dismissed',
  },
})

export const historyMessages = defineMessages({
  edited: {
    id: 'ss.application:historyMessages.edited',
    defaultMessage: 'Umsókn færð tilbaka í vinnslu',
    description: 'History message application edited',
  },
  changesAborted: {
    id: 'ss.application:historyMessages.changesAborted',
    defaultMessage: 'Hætt við breytingar',
    description: 'History message application changes aborted',
  },
  reviewFinished: {
    id: 'ss.application:historyMessages.reviewFinished',
    defaultMessage: 'Yfirferð lokið',
    description: 'History message application review finished',
  },
  reviewWithdrawn: {
    id: 'ss.application:historyMessages.reviewWithdrawn',
    defaultMessage: 'Yfirferð hafin á ný',
    description: 'History message application review withdrawn',
  },
  applicationDismissed: {
    id: 'ss.application:historyMessages.applicationDismissed',
    defaultMessage: 'Umsókn vísað frá',
    description: 'History message application dismissed',
  },
})

export const pendingActionMessages = defineMessages({
  waitingForReviewTitle: {
    id: 'ss.application:pendingActionMessages.waitingForReviewTitle',
    defaultMessage: 'Umsókn bíður yfirferðar',
    description: 'Pending action waiting for review',
  },
  inReviewTitle: {
    id: 'ss.application:pendingActionMessages.inReviewTitle',
    defaultMessage: 'Er í yfirferð',
    description: 'Pending action message application in review title',
  },
  inReviewDescription: {
    id: 'ss.application:pendingActionMessages.inReviewDescription',
    defaultMessage: 'Umsóknin þín er í yfirferð',
    description: 'Pending action message application in review description',
  },
  reviewFinishedTitle: {
    id: 'ss.application:pendingActionMessages.reviewFinishedTitle',
    defaultMessage: 'Yfirferð lokið',
    description:
      'Pending action message application review finished description',
  },
  reviewFinishedDescription: {
    id: 'ss.application:pendingActionMessages.reviewFinishedDescription',
    defaultMessage: 'Yfirferð á umsókn þinni hefur verið lokið',
    description:
      'Pending action message application review finished description',
  },
})
